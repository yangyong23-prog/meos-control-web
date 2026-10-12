import fs from 'fs';
import XLSX from 'xlsx'; // excel生成库
import _ from 'lodash';
import zhLocale from '../../locales/langs/zh.json' assert { type: 'json' };
const zhmap = {}; // 中文配置
async function main() {
    const file = process.argv[process.argv.length - 1];
    const workbook = await XLSX.readFileSync(file, {});
    const commonsheet = workbook.Sheets['sheet0'];
    const jsa = XLSX.utils.sheet_to_json(commonsheet, { header: 1 }).slice(1);
    const newMap = {};
    const chineseKey = [];
    const engllishKey = [];
    for (const j of jsa) {
        if (j[0] && j[1]) {
            chineseKey.push(j[0]);
            engllishKey.push(j[1]);
            newMap[j[1].toLowerCase()] = j[0];
        }
    }
    for (let key in zhLocale) {
        for (let secondKey in zhLocale[key]) {
            // let repeatC = false, repeatE = false;
            // if(typeof zhLocale[key][secondKey] == 'string'){
            //     if(chineseKey.indexOf(zhLocale[key][secondKey]) >= 0){
            //         console.log('重复', zhLocale[key][secondKey])
            //         repeatC = true;
            //     }else if(engllishKey.indexOf(secondKey) >= 0) {
            //         console.log('repeat', secondKey)
            //         repeatE = true
            //     }
            //     zhmap[zhLocale[key][secondKey]] = `${key}.${secondKey}`;
            // }
            if (key === 'meos_control_web') {
                for (let newKey in newMap) {
                    if (newMap[newKey] === zhLocale[key][secondKey]) {
                        if (newKey === secondKey) {
                        } else {
                            // console.log('中文一致', newMap[newKey], newKey, secondKey)
                        }
                    } else if (newKey === secondKey) {
                        console.log('key 一致', newKey, newMap[newKey], zhLocale[key][secondKey]);
                        zhLocale[key][secondKey + 'b1'] = newMap[secondKey];
                    } else {
                        zhLocale[key][newKey] = newMap[newKey];
                    }
                }
            }
        }
    }
    // console.log(zhmap);

    // let enstring = '{\n    "meos_control_web": {\n';
    // let zhstring = '{\n    "meos_control_web": {\n';
    // for (let line of commondata) {
    //     if (line[0] && line[1]) {
    //         enstring += '        "' + line[0] + '": "' + line[2] + '",\n';
    //         zhstring += '        "' + line[0] + '": "' + line[1] + '",\n';
    //     }
    // }
    // enstring = enstring.replace(/,\n$/, '\n');
    // zhstring = zhstring.replace(/,\n$/, '\n');
    // enstring += '    }\n}\n';
    // zhstring += '    }\n}\n';
    // console.log(enstring, zhstring);
    await fs.writeFileSync('./localization/zh.json', JSON.stringify(zhLocale, null, 4), { encoding: 'utf-8' });
}

main();
