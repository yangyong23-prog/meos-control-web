import fs from 'fs';
import XLSX from 'xlsx'; // excel生成库
import _ from 'lodash';
import path from 'path';
import zhLocale from '../../locales/langs/zh.json' assert { type: 'json' };
const zhmap = {}; // 中文配置
const already = [];
async function main() {
    const file = process.argv[process.argv.length - 1];
    const workbook = await XLSX.readFileSync(`${file}`, {});
    const data = {},
        sheet = workbook.Sheets['sheet0'];
    const jsa = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(jsa);
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
    const map = {};
    for (const j of jsa) {
        console.log(j);
        if (j[1] && !map[j[1]] && !zhmap[j[1]]) {
            already.push({
                中文: j[1]
            });
            map[j[1]] = 1;
        }
    }
    console.log(already);
    const worksheet = XLSX.utils.json_to_sheet(already);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet4');
    await XLSX.writeFileSync(workbook, path.join(`./output/中文key结果${new Date().getTime()}.xlsx`), {});
}

main();
