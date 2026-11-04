// @ts-ignore
import i18n from '@/localization';
/* eslint-disable radix */
/* eslint-disable no-case-declarations */
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
/**
 * Represents a message sent in an event stream
 * https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format
 */

import { storeLog } from './sseLog';

const enum ControlChars {
    NewLine = 10, // 换行符
    CarriageReturn = 13, // CarriageReturn
    Space = 32, // 空格符
    Colon = 58 // 冒号
}

const MAX_BUFFER_SIZE = 50 * 1024 * 1024; // 50MB  超过这个大小就丢弃数据

const getMemoryStr = (byteLength: number) => {
    const kb = 1024;
    const mb = kb * kb;
    const gb = mb * kb;
    if (byteLength < kb) {
        return `${byteLength} B`;
    }
    if (byteLength < mb) {
        return `${(byteLength / kb).toFixed(2)} KB`;
    }
    if (byteLength < gb) {
        return `${(byteLength / mb).toFixed(2)} MB`;
    }
};

export interface EventSourceMessage {
    /** The event ID to set the EventSource object's last event ID value. */
    id: string;
    /** A string identifying the type of event described. */
    event: string;
    /** The event data */
    data: string;
    /** The reconnection interval (in milliseconds) to wait before retrying the connection */
    retry?: number;
    size?: string;
    /** opt/edge-call：SSE 注释行内容（":xxx"），服务端用它下发 EVENT_ID 的 eventKey */
    comment?: string;
}

/**
 * Converts a ReadableStream into a callback pattern.
 * @param stream The input ReadableStream.
 * @param onChunk A function that will be called on each new byte chunk in the stream.
 * @returns {Promise<void>} A promise that will be resolved when the stream closes.
 */
export async function getBytes(stream: ReadableStream<Uint8Array>, onChunk: (arr: Uint8Array) => void) {
    const reader = stream.getReader();
    // eslint-disable-next-line no-undef
    let result: ReadableStreamReadResult<Uint8Array>,
        chunkCount = 0;
    const YIELD_EVERY = 50;
    while (!(result = await reader.read()).done) {
        onChunk(result.value);
        if (++chunkCount >= YIELD_EVERY) {
            chunkCount = 0;
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
}

/**
 * Parses arbitary byte chunks into EventSource line buffers.
 * Each line should be of the format "field: value" and ends with \r, \n, or \r\n.
 * @param onLine A function that will be called on each new EventSource line.
 * @returns A function that should be called for each incoming byte chunk.
 */
export function getLines(onLine: (line?: Uint8Array, fieldLength?: number, discardingLength?: number) => void, discardWhenOversize = true) {
    let buffer: Uint8Array | undefined,
        position: number, // current read position
        fieldLength: number, // length of the `field` portion of the line
        discardTrailingNewline = false,
        discarding = false, // 正在丢弃数据
        discardingLength = 0; // 丢弃的长度

    // return a function that can process each incoming byte chunk:
    return function onChunk(arr: Uint8Array) {
        if (discarding) {
            discardingLength += arr.byteLength;
            let chunkLineEnd = -1,
                chunkPos = 0;
            for (; chunkPos < arr.byteLength && chunkLineEnd === -1; ++chunkPos) {
                if (arr[chunkPos] === ControlChars.NewLine) {
                    chunkLineEnd = chunkPos;
                }
            }

            if (chunkLineEnd !== -1) {
                // 丢弃掉一条消息
                onLine(undefined, undefined, discardingLength);
                if (chunkLineEnd + 1 < arr.byteLength) {
                    buffer = arr.subarray(chunkLineEnd + 1);
                } else {
                    buffer = undefined;
                }
                console.log('Discarding End !; 丢弃包大小：', getMemoryStr(discardingLength));
                position = 0;
                fieldLength = -1;
                discardTrailingNewline = false;
                discarding = false; // 正在丢弃数据
                discardingLength = 0; // 丢弃的长度
            }
            return;
        }

        if (buffer === undefined) {
            buffer = arr;
            position = 0;
            fieldLength = -1;
        } else {
            // we're still parsing the old line. Append the new bytes into buffer:
            buffer = concat(buffer, arr);
            if (discardWhenOversize && buffer.byteLength > MAX_BUFFER_SIZE) {
                // 超过最大限制，开启丢弃模式
                console.log('buffer oversize. Discarding...', buffer.byteLength);
                discarding = true;
                discardingLength = buffer.byteLength;
            }
        }

        const bufLength = buffer.length;
        let lineStart = 0; // index where the current line starts
        while (position < bufLength) {
            if (discardTrailingNewline) {
                if (buffer[position] === ControlChars.NewLine) {
                    lineStart = ++position; // skip to next char
                }

                discardTrailingNewline = false;
            }

            // start looking forward till the end of line:
            let lineEnd = -1; // index of the \r or \n char
            for (; position < bufLength && lineEnd === -1; ++position) {
                switch (buffer[position]) {
                    case ControlChars.Colon:
                        if (fieldLength === -1) {
                            // first colon in line
                            fieldLength = position - lineStart;
                        }
                        break;
                    // @ts-ignore:7029 \r case below should fallthrough to \n:
                    case ControlChars.CarriageReturn:
                        discardTrailingNewline = true;
                    case ControlChars.NewLine:
                        lineEnd = position;
                        break;
                }
            }

            if (lineEnd === -1) {
                // We reached the end of the buffer but the line hasn't ended.
                // Wait for the next arr and then continue parsing:
                break;
            }

            // we've reached the line end, send it out:
            onLine(buffer.subarray(lineStart, lineEnd), fieldLength);

            lineStart = position; // we're now on the next line
            fieldLength = -1;
        }

        if (lineStart === bufLength) {
            buffer = undefined; // we've finished reading it
        } else if (lineStart !== 0) {
            // Create a new view into buffer beginning at lineStart so we don't
            // need to copy over the previous lines when we get the new arr:
            buffer = buffer.subarray(lineStart);
            position -= lineStart;
        }
    };
}

/**
 * Parses line buffers into EventSourceMessages.
 * @param onId A function that will be called on each `id` field.
 * @param onRetry A function that will be called on each `retry` field.
 * @param onMessage A function that will be called on each message.
 * @returns A function that should be called for each incoming line buffer.
 */
export function getMessages(onId: (id: string) => void, onRetry: (retry: number) => void, onMessage?: (msg: EventSourceMessage) => void) {
    let message = newMessage();
    const decoder = new TextDecoder();

    // return a function that can process each incoming line buffer:
    return function onLine(line?: Uint8Array, fieldLength?: number, discardLength?: number) {
        if (!line) {
            message.data = i18n.global.t('meos_control_web.data_too_large_dropped');
            message.size = getMemoryStr(discardLength || 0);
            console.log('抛弃掉一条消息 message>>>>', message);
            storeLog(message);
            message = newMessage();
            return;
        }
        if (line.length === 0) {
            // empty line denotes end of message. Trigger the callback and start a new message:
            onMessage?.(message);
            message = newMessage();
        } else if (fieldLength === 0) {
            // opt/edge-call：注释行（":xxx"）。原逻辑直接丢弃；这里记到 message.comment，供读取 EVENT_ID 的 eventKey。
            const comment = decoder.decode(line.subarray(1)).trim();
            message.comment = message.comment ? `${message.comment}\n${comment}` : comment;
        } else if (fieldLength && fieldLength > 0) {
            // exclude comments and lines with no values
            // line is of format "<field>:<value>" or "<field>: <value>"
            // https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
            const field = decoder.decode(line.subarray(0, fieldLength));
            const valueOffset = fieldLength + (line[fieldLength + 1] === ControlChars.Space ? 2 : 1);
            const value = decoder.decode(line.subarray(valueOffset));

            switch (field) {
                case 'data':
                    // if this message already has data, append the new value to the old.
                    // otherwise, just set to the new value:
                    message.data = message.data ? message.data + '\n' + value : value; // otherwise,
                    break;
                case 'event':
                    message.event = value;
                    break;
                case 'id':
                    onId((message.id = value));
                    break;
                case 'retry':
                    const retry = parseInt(value, 10);
                    if (!isNaN(retry)) {
                        // per spec, ignore non-integers
                        onRetry((message.retry = retry));
                    }
                    break;
            }
        }
    };
}

function concat(a: Uint8Array, b: Uint8Array) {
    const res = new Uint8Array(a.length + b.length);
    res.set(a);
    res.set(b, a.length);
    return res;
}

function newMessage(): EventSourceMessage {
    // data, event, and id must be initialized to empty strings:
    // https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
    // retry should be initialized to undefined so we return a consistent shape
    // to the js engine all the time: https://mathiasbynens.be/notes/shapes-ics#takeaways
    return {
        data: '',
        event: '',
        id: '',
        retry: undefined
    };
}
