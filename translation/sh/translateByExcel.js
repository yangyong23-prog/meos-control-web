import fs from 'fs';
import XLSX from 'xlsx';
import _ from 'lodash';
import path from 'path';
import zhLocale from '../../locales/langs/zh.json' assert { type: 'json' };

const zhmap = {}; // 中文配置
const fileToKeyMap = {}; // 文件对应的翻译
const okLines = []; // 成功替换的
const restLines = []; // 未成功替换的
function getJsFileBasename(filename) {
    var i = filename.lastIndexOf('.');
    if (i < 0) i = filename.length;
    var basename = filename.substr(i + 1);

    if (basename === '') {
        return false;
    } else {
        return basename;
    }
}

const translateFile = async filepath => {
    const basename = getJsFileBasename(filepath);
    let replaced = false;
    let data;
    // vue文件的修改
    if (basename === 'vue') {
        data = await fs.readFileSync(filepath, { encoding: 'utf-8' });
        let startMatch = false;
        // 按照回车分成一行行的文本数组
        const lines = data.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
            const r = lines[i];
            if (r.match(/\<script /gi) && !startMatch) {
                startMatch = true;
            }

            if (r.match(/\<\/script\>/gi) && startMatch) {
                startMatch = false;
            }
            // vue代码
            if (r.match(/[\u4e00-\u9fa5，。！：、]+/gi)) {
                const res = r.match(/[^\r\n]{0,1000}([\u4e00-\u9fa5，。！：、]+)[^\r\n]{0,1000}/gi);
                for (let line of res) {
                    for (let row of fileToKeyMap[filepath]) {
                        if (line == row['line']) {
                            replaced = false;
                            // 匹配vue template
                            const words = line.match(/\>[^\>\<]+\</gi);
                            if (words) {
                                for (let word of words) {
                                    const chineseword = word.slice(1, -1).trim();
                                    if (chineseword) {
                                        if (chineseword === row['zh']) {
                                            const replaceline = line.replace(word, '>{{ ' + `i18n.global.t('${zhmap[row['zh']]}')` + ' }}<');
                                            replaced = true;
                                            data = data.replace(line, replaceline);
                                            line = line.replace(word, '>{{ ' + `i18n.global.t('${zhmap[row['zh']]}')` + ' }}<');
                                            okLines.push({
                                                中文: row['zh'],
                                                key: zhmap[row['zh']],
                                                行号: i + 1,
                                                上下文: line,
                                                文件位置: filepath
                                            });
                                        }
                                    }
                                }
                            }
                            // 匹配``这种
                            const wordline = line.match(/\`[^\`]+\`/gi);
                            if (wordline) {
                                for (let word of wordline) {
                                    const chineseword = word.slice(1, -1).trim();
                                    if (chineseword) {
                                        if (chineseword === row['zh']) {
                                            const replaceline = line.replace(word, '`${' + `i18n.global.t('${zhmap[row['zh']]}')` + '}`');
                                            replaced = true;
                                            data = data.replace(line, replaceline);
                                            line = replaceline;
                                            okLines.push({
                                                中文: row['zh'],
                                                key: zhmap[row['zh']],
                                                行号: i + 1,
                                                上下文: line,
                                                文件位置: filepath
                                            });
                                        }
                                    }
                                }
                            }
                            const word_half = line.match(/\>\S+/gi);
                            if (word_half) {
                                for (let word of word_half) {
                                    // console.log(word);
                                    const chineseword = word.match(/[\u4e00-\u9fa5]+[\d\（\S\-，～%\.。！：、/]*/);
                                    if (chineseword) {
                                        if (chineseword[0] === row['zh']) {
                                            const replaceline = line.replace(chineseword[0], '{{ ' + `i18n.global.t('${zhmap[row['zh']]}')` + ' }}');
                                            replaced = true;
                                            data = data.replace(line, replaceline);
                                            line = replaceline;
                                            okLines.push({
                                                中文: row['zh'],
                                                key: zhmap[row['zh']],
                                                行号: i + 1,
                                                上下文: line,
                                                文件位置: filepath
                                            });
                                        }
                                    }
                                }
                            }
                            const word_half2 = line.match(/\S+\</gi);
                            if (word_half2) {
                                for (let word of word_half2) {
                                    // console.log(word);
                                    const chineseword = word.match(/[\u4e00-\u9fa5]+[\d\（\-，～%\.。！：、/]*/);
                                    if (chineseword) {
                                        if (chineseword[0] === row['zh']) {
                                            const replaceline = line.replace(chineseword[0], '{{ ' + `i18n.global.t('${zhmap[row['zh']]}')` + ' }}');
                                            replaced = true;
                                            data = data.replace(line, replaceline);
                                            line = replaceline;
                                            okLines.push({
                                                中文: row['zh'],
                                                key: zhmap[row['zh']],
                                                行号: i + 1,
                                                上下文: line,
                                                文件位置: filepath
                                            });
                                        }
                                    }
                                }
                            }
                            // 匹配vue全换行的
                            const word_toRplaces = line.match(/\s+\S+\s*/gi);
                            if (word_toRplaces) {
                                for (let word of word_toRplaces) {
                                    const chineseword = word.match(/[\u4e00-\u9fa5]+[\d\（\S\-，～%\.。！：、/]*/);
                                    if (chineseword) {
                                        if (chineseword[0] === row['zh']) {
                                            const replaceline = line.replace(chineseword[0], '{{ ' + `i18n.global.t('${zhmap[row['zh']]}')` + ' }}');
                                            replaced = true;
                                            data = data.replace(line, replaceline);
                                            line = replaceline;
                                            okLines.push({
                                                中文: row['zh'],
                                                key: zhmap[row['zh']],
                                                行号: i + 1,
                                                上下文: line,
                                                文件位置: filepath
                                            });
                                        }
                                    }
                                }
                            }
                            // 匹配:x="''"这种
                            const words2 = line.match(/\:[\w-]+\=\"\'[\u4e00-\u9fa5，。！、：]+\'\"/gi);
                            // console.log(line);
                            if (words2) {
                                for (let word of words2) {
                                    const chineseword = word.match(/[\u4e00-\u9fa5，。！、：]+/);
                                    if (chineseword && chineseword[0]) {
                                        if (chineseword[0] === row['zh']) {
                                            const replaceline = line.replace(`'${chineseword[0]}'`, `i18n.global.t('${zhmap[row['zh']]}')`);
                                            replaced = true;
                                            data = data.replace(line, replaceline);
                                            line = replaceline;
                                            okLines.push({
                                                中文: row['zh'],
                                                key: zhmap[row['zh']],
                                                行号: i + 1,
                                                上下文: line,
                                                文件位置: filepath
                                            });
                                        }
                                    }
                                }
                            }
                            // 匹配x=''这种
                            const words3 = line.match(/[^\:]\w+\=[\'][^\']+[\']/gi);
                            // console.log(line);
                            if (words3) {
                                for (let word of words3) {
                                    const realword = word.match(/[\'][^\']+[\']/);
                                    const chineseword = word.match(/[\']([^\']+)[\']/);
                                    if (chineseword && chineseword[1]) {
                                        if (chineseword[1] === row['zh']) {
                                            const word2 = ' :' + _.trim(word.replace(realword[0], `"i18n.global.t('${zhmap[row['zh']]}')"`));
                                            const replaceline = line.replace(word, word2);
                                            replaced = true;
                                            data = data.replace(line, replaceline);
                                            line = replaceline;
                                            okLines.push({
                                                中文: row['zh'],
                                                key: zhmap[row['zh']],
                                                行号: i + 1,
                                                上下文: line,
                                                文件位置: filepath
                                            });
                                        }
                                    }
                                }
                            }

                            // 匹配x=""这种
                            const words3_1 = line.match(/[^\:]\w+\=[\"][^\"]+[\"]/gi);
                            // console.log(line);
                            if (words3_1) {
                                for (let word of words3_1) {
                                    const realword = word.match(/[\"][^\"]+[\"]/);
                                    const chineseword = word.match(/[\"]([^\"]+)[\"]/);
                                    if (chineseword && chineseword[1]) {
                                        if (chineseword[1] === row['zh']) {
                                            const word2 = ' :' + _.trim(word.replace(realword[0], `"i18n.global.t('${zhmap[row['zh']]}')"`));

                                            const replaceline = line.replace(word, word2);
                                            replaced = true;
                                            data = data.replace(line, replaceline);
                                            line = replaceline;
                                            okLines.push({
                                                中文: row['zh'],
                                                key: zhmap[row['zh']],
                                                行号: i + 1,
                                                上下文: line,
                                                文件位置: filepath
                                            });
                                        }
                                    }
                                }
                            }

                            // 匹配三目运算这种
                            const words4 = line.match(/\?\s{0,8}[\'\"][\u4e00-\u9fa5，。！、：]+[\'\"]\s{0,8}\:\s{0,8}[\'\"][\u4e00-\u9fa5，。！、：\d]+[\'\"]/gi);
                            if (words4) {
                                for (let word of words4) {
                                    const chinesewords = word.match(/[\'\"][\u4e00-\u9fa5，。！、：]+[\'\"]/gi);
                                    let word2 = `${word}`;
                                    for (let chword of chinesewords) {
                                        const chineseword = chword.slice(1, -1);
                                        // console.log(chword, chineseword, zhmap[chineseword]);
                                        if (chineseword === row['zh']) {
                                            word2 = word2.replace(chword, `i18n.global.t('${zhmap[row['zh']]}')`);
                                            // console.log(word2);
                                            const replaceline = line.replace(word, word2);
                                            // console.log(line, replaceline);
                                            replaced = true;
                                            data = data.replace(line, replaceline);
                                            line = replaceline;
                                            okLines.push({
                                                中文: row['zh'],
                                                key: zhmap[row['zh']],
                                                行号: i + 1,
                                                上下文: line,
                                                文件位置: filepath
                                            });
                                        }
                                    }
                                }
                                // 匹配:""字符串
                            } else {
                                const wordswidhtcomma = line.match(/\:\s{0,8}[\'][\u4e00-\u9fa5，。！、：]+[\']/gi);
                                if (wordswidhtcomma) {
                                    for (let word of wordswidhtcomma) {
                                        const chineseword = word.match(/[\u4e00-\u9fa5，。！、：]+/);
                                        if (chineseword && chineseword[0]) {
                                            if (chineseword[0] === row['zh']) {
                                                const word2 = word.replace(`'${row['zh']}'`, `i18n.global.t('${zhmap[row['zh']]}')`);

                                                let replaceline = line.replace(word, word2);
                                                const word3 = word.replace(`"${row['zh']}"`, `i18n.global.t('${zhmap[row['zh']]}')`);
                                                replaced = true;
                                                replaceline = replaceline.replace(word, word3);
                                                data = data.replace(line, replaceline);
                                                line = replaceline;
                                                okLines.push({
                                                    中文: row['zh'],
                                                    key: zhmap[row['zh']],
                                                    行号: i + 1,
                                                    上下文: line,
                                                    文件位置: filepath
                                                });
                                            }
                                        }
                                    }
                                }
                                const wordswidhtcomma1 = line.match(/\:\s{0,8}[\"][\u4e00-\u9fa5，。！、：]+[\"]/gi);
                                if (wordswidhtcomma1) {
                                    for (let word of wordswidhtcomma1) {
                                        const chineseword = word.match(/[\u4e00-\u9fa5，。！、：]+/);
                                        if (chineseword && chineseword[0]) {
                                            if (chineseword[0] === row['zh']) {
                                                const word2 = word.replace(`'${row['zh']}'`, `i18n.global.t('${zhmap[row['zh']]}')`);

                                                let replaceline = line.replace(word, word2);
                                                const word3 = word.replace(`"${row['zh']}"`, `i18n.global.t('${zhmap[row['zh']]}')`);
                                                replaced = true;
                                                replaceline = replaceline.replace(word, word3);
                                                data = data.replace(line, replaceline);
                                                line = replaceline;
                                                okLines.push({
                                                    中文: row['zh'],
                                                    key: zhmap[row['zh']],
                                                    行号: i + 1,
                                                    上下文: line,
                                                    文件位置: filepath
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                            // 在script内部
                            if (startMatch) {
                                // 匹配字符串
                                const words = line.match(/[\'][^\']+[\']/gi);
                                if (words) {
                                    for (let word of words) {
                                        const chineseword = word.slice(1, -1);
                                        if (chineseword) {
                                            if (chineseword === row['zh']) {
                                                replaced = true;
                                                const replaceline = line.replace(word, '' + `i18n.global.t('${zhmap[row['zh']]}')` + '');
                                                data = data.replace(line, replaceline);
                                                line = replaceline;
                                                okLines.push({
                                                    中文: row['zh'],
                                                    key: zhmap[row['zh']],
                                                    行号: i + 1,
                                                    上下文: line,
                                                    文件位置: filepath
                                                });
                                            }
                                        }
                                    }
                                }

                                const words1 = line.match(/[\"][^\"]+[\"]/gi);
                                if (words1) {
                                    for (let word of words1) {
                                        const chineseword = word.slice(1, -1);
                                        if (chineseword) {
                                            if (chineseword === row['zh']) {
                                                replaced = true;
                                                const replaceline = line.replace(word, '' + `i18n.global.t('${zhmap[row['zh']]}')` + '');
                                                data = data.replace(line, replaceline);
                                                line = replaceline;
                                                okLines.push({
                                                    中文: row['zh'],
                                                    key: zhmap[row['zh']],
                                                    行号: i + 1,
                                                    上下文: line,
                                                    文件位置: filepath
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                            row.replaced = replaced;
                        }
                    }
                }
            }
        }
    } else if (basename === 'js' || basename === 'ts') {
        data = await fs.readFileSync(filepath, { encoding: 'utf-8' });
        // 匹配中文
        const lines = data.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
            const r = lines[i];
            if (r.match(/[\u4e00-\u9fa5，。！：、]+/gi)) {
                const res = r.match(/[^\r\n]{0,1000}([\u4e00-\u9fa5，。！：、]+)[^\r\n]{0,1000}/gi);
                for (let line of res) {
                    for (let row of fileToKeyMap[filepath]) {
                        if (line == row['line']) {
                            replaced = false;
                            // 匹配字符串
                            const words = line.match(/[\'][^']+[\']/gi);
                            if (words) {
                                for (let word of words) {
                                    const chineseword = word.slice(1, -1);
                                    for (let row of fileToKeyMap[filepath]) {
                                        if (chineseword === row['zh']) {
                                            const replaceline = line.replace(word, '' + `i18n.global.t('${zhmap[row['zh']]}')` + '');
                                            data = data.replace(line, replaceline);
                                            replaced = true;
                                            line = replaceline;
                                            okLines.push({
                                                中文: row['zh'],
                                                key: zhmap[row['zh']],
                                                行号: i + 1,
                                                上下文: line,
                                                文件位置: filepath
                                            });
                                        }
                                    }
                                }
                            }
                            // 匹配``这种
                            const wordline = line.match(/\`[^\`]+\`/gi);
                            if (wordline) {
                                for (let word of wordline) {
                                    const chineseword = word.slice(1, -1).trim();
                                    if (chineseword) {
                                        if (chineseword === row['zh']) {
                                            const replaceline = line.replace(word, '`${' + `i18n.global.t('${zhmap[row['zh']]}')` + '}`');
                                            replaced = true;
                                            data = data.replace(line, replaceline);
                                            line = replaceline;
                                            okLines.push({
                                                中文: row['zh'],
                                                key: zhmap[row['zh']],
                                                行号: i + 1,
                                                上下文: line,
                                                文件位置: filepath
                                            });
                                        }
                                    }
                                }
                            }
                            const words1 = line.match(/[\"][^"]+[\"]/gi);
                            if (words1) {
                                for (let word of words1) {
                                    const chineseword = word.slice(1, -1);
                                    if (chineseword === row['zh']) {
                                        const replaceline = line.replace(word, '' + `i18n.global.t('${zhmap[row['zh']]}')` + '');
                                        data = data.replace(line, replaceline);
                                        replaced = true;
                                        line = replaceline;
                                        okLines.push({
                                            中文: row['zh'],
                                            key: zhmap[row['zh']],
                                            行号: i + 1,
                                            上下文: line,
                                            文件位置: filepath
                                        });
                                    }
                                }
                            }

                            // console.log(line);
                            // 匹配三目运算这种
                            const words4 = line.match(/\?\s{0,8}[\'\"][\u4e00-\u9fa5，。！、：]+[\'\"]\s{0,8}\:\s{0,8}[\'\"][\u4e00-\u9fa5，。！、：\d]+[\'\"]/gi);
                            if (words4) {
                                // console.log(line, words4)
                                for (let word of words4) {
                                    const chinesewords = word.match(/[\'\"][\u4e00-\u9fa5，。！、：]+[\'\"]/gi);
                                    let word2 = `${word}`;
                                    for (let chword of chinesewords) {
                                        // console.log(chword);
                                        const chineseword = chword.slice(1, -1);
                                        if (chineseword === row['zh']) {
                                            word2 = word2.replace(chword, `i18n.global.t('${zhmap[row['zh']]}')`);
                                            const replaceline = line.replace(word, word2);
                                            data = data.replace(line, replaceline);
                                            line = replaceline;
                                            replaced = true;
                                            okLines.push({
                                                中文: row['zh'],
                                                key: zhmap[row['zh']],
                                                行号: i + 1,
                                                上下文: line,
                                                文件位置: filepath
                                            });
                                        }
                                    }
                                }
                            } else {
                                // 匹配:""字符串
                                const wordswidhtcomma = line.match(/\:\s{0,8}[\'][\u4e00-\u9fa5，。！、：]+[\']/gi);
                                if (wordswidhtcomma) {
                                    for (let word of wordswidhtcomma) {
                                        const chineseword = word.match(/[\u4e00-\u9fa5，。！、：]+/);
                                        if (chineseword && chineseword[0]) {
                                            if (chineseword[0] === row['zh']) {
                                                const word2 = word.replace(`'${row['zh']}'`, `i18n.global.t('${zhmap[row['zh']]}')`);

                                                let replaceline = line.replace(word, word2);
                                                const word3 = word.replace(`"${row['zh']}"`, `i18n.global.t('${zhmap[row['zh']]}')`);

                                                replaceline = replaceline.replace(word, word3);
                                                data = data.replace(line, replaceline);
                                                line = replaceline;
                                                replaced = true;
                                                okLines.push({
                                                    中文: row['zh'],
                                                    key: zhmap[row['zh']],
                                                    行号: i + 1,
                                                    上下文: line,
                                                    文件位置: filepath
                                                });
                                            }
                                        }
                                    }
                                }
                                const wordswidhtcomma1 = line.match(/\:\s{0,8}[\"][\u4e00-\u9fa5，。！、：]+[\"]/gi);
                                if (wordswidhtcomma1) {
                                    for (let word of wordswidhtcomma1) {
                                        const chineseword = word.match(/[\u4e00-\u9fa5，。！、：]+/);
                                        if (chineseword && chineseword[0]) {
                                            if (chineseword[0] === row['zh']) {
                                                const word2 = word.replace(`'${row['zh']}'`, `i18n.global.t('${zhmap[row['zh']]}')`);

                                                let replaceline = line.replace(word, word2);
                                                const word3 = word.replace(`"${row['zh']}"`, `i18n.global.t('${zhmap[row['zh']]}')`);

                                                replaceline = replaceline.replace(word, word3);
                                                data = data.replace(line, replaceline);
                                                line = replaceline;
                                                replaced = true;
                                                okLines.push({
                                                    中文: row['zh'],
                                                    key: zhmap[row['zh']],
                                                    行号: i + 1,
                                                    上下文: line,
                                                    文件位置: filepath
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                            row.replaced = replaced;
                        }
                    }
                }
            }
        }
    }

    for (let row of fileToKeyMap[filepath]) {
        if (row.replaced === false) {
            restLines.push({
                ...row,
                文件位置: filepath
            });
        }
    }

    await fs.writeFileSync(filepath, data, { encoding: 'utf-8' });
};
const translateDir = async dir => {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });
    for (let file of files) {
        if (
            dir.match(/src\/assets/gi) ||
            file.match(/src\/router/gi) ||
            dir.match(/src\/api\/assetService/gi) ||
            dir.match(/src\/locale/gi) ||
            dir.match(/mocks/) ||
            file.name.match(/mock\.js$/gi) ||
            file.name.match(/templatescene\.js$/gi) ||
            file.name.match(/mockdata\.js$/gi) ||
            file.name.match(/firecontrol\.js$/gi) ||
            dir.match(/src\/views\/test/gi) ||
            dir.match(/src\/types/gi) ||
            file.name.match(/\.d\.js$/gi)
        ) {
            return;
        }
        const p = path.join(dir, file.name);
        const basename = getJsFileBasename(file.name);
        if (file.isFile()) {
            if (!['jpg', 'jpeg', 'png', 'less', 'json', 'gif', 'svg', 'md', 'wasm'].includes(basename) && !file.name.match(/min\.js$/gi)) {
                translateFile(p);
            }
        } else if (file.isDirectory()) {
            await translateDir(p);
        }
    }
};

async function main() {
    const file = process.argv[process.argv.length - 1];
    const workbook = await XLSX.readFileSync(`${file}`, {});
    const sheet = workbook.Sheets['sheet0'];
    const jsa = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(1);
    for (let key in zhLocale) {
        if (key !== 'operation_duty_homepage') {
            for (let secondKey in zhLocale[key]) {
                if (typeof zhLocale[key][secondKey] == 'string') {
                    zhmap[zhLocale[key][secondKey]] = `${key}.${secondKey}`;
                } else {
                    for (let thirdkey in zhLocale[key][secondKey]) {
                        if (typeof zhLocale[key][secondKey][thirdkey] == 'string') {
                            zhmap[zhLocale[key][secondKey][thirdkey]] = `${key}.${secondKey}.${thirdkey}`;
                        }
                    }
                }
            }
        }
    }
    let currentkey = '';
    let currentChinese = '';

    // console.log('-----------------', jsa);
    for (const j of jsa) {
        // key  中文 英文 上下文 行号 文件地址
        // console.log(j[0], j[1], j[2], j[3], j[4], j[5]);
        if (j[1]) {
            // currentkey = j[0];
            currentChinese = j[1];
            // zhmap[currentChinese] = currentkey;
        }
        currentkey = zhmap[currentChinese];
        if (currentkey && currentChinese && j[4] && j[5]) {
            if (!fileToKeyMap[j[5]]) {
                fileToKeyMap[j[5]] = [];
            }
            fileToKeyMap[j[5]].push({
                key: currentkey,
                zh: currentChinese,
                no: j[4],
                line: j[3]
            });
        }
    }
    for (let key in fileToKeyMap) {
        await translateFile(key);
    }

    if (file) {
        const workbook = XLSX.utils.book_new();
        const worksheet0 = XLSX.utils.json_to_sheet(okLines);
        const worksheet1 = XLSX.utils.json_to_sheet(restLines);
        XLSX.utils.book_append_sheet(workbook, worksheet0, '成功');
        XLSX.utils.book_append_sheet(workbook, worksheet1, '未成功');
        await XLSX.writeFileSync(workbook, path.join(`./failed/翻译结果${new Date().getTime()}.xlsx`), {});
    } else {
        console.error('缺少相对路径 例：npm run translate ./src/views');
    }
}

main();
