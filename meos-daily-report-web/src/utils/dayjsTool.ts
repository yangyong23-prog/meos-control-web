import dayjs from 'dayjs';

export function dayTz(...args) {
    // Check if first argument is a string that needs format conversion
    if (args.length > 0 && typeof args[0] === 'string') {
        const datePattern = /^\d{4}\.\d{2}\.\d{2}/; // YYYY.MM.DD 或 YYYY.MM.DD HH:mm:ss
        const datePattern3 = /^\d{4}\/\d{2}\/\d{2}/; // YYYY/MM/DD HH:mm:ss

        if (datePattern.test(args[0])) {
            // Convert YYYY.MM.DD or YYYY.MM.DD HH:mm:ss to YYYY-MM-DD or YYYY-MM-DD HH:mm:ss
            args[0] = args[0].replace(/\./g, '-');
        } else if (datePattern3.test(args[0])) {
            // Convert YYYY/MM/DD HH:mm:ss to YYYY-MM-DD HH:mm:ss
            args[0] = args[0].replace(/\//g, '-');
        }
    }

    // Call dayjs.tz with the processed arguments
    return dayjs.tz(...args);
}
