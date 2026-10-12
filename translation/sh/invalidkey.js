import fs from 'fs';
import XLSX from 'xlsx'; // excel生成库
import _ from 'lodash';
import path from 'path';
import zhLocale from '../../locales/langs/zh.json' assert { type: 'json' };
const zhmap = {}; // 中文配置
const already = [];
const validKey = [];
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
// 扫描一个目录下的所有文件
const scanDir = async dir => {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });
    // 如果是assets, mokes, api, test文件夹下的文件，不扫描
    // 如果有其他文件夹要添加可以手动添加
    if (
        dir.match(/src\/assets/gi) ||
        dir.match(/src\/mocks/gi) ||
        dir.match(/src\/api\/assetService/gi) ||
        dir.match(/mock\.js$/gi) ||
        dir.match(/src\/views\/GraphMVC/gi) ||
        dir.match(/src\/router/gi) ||
        dir.match(/src\/demo/gi) ||
        dir.match(/src\/views\/machine-room-safety\/floor-map\/constant/gi) ||
        dir.match(/src\/views\/test/gi)
    ) {
        return;
    }

    for (let file of files) {
        // 如果是assets, api, mock.js, templatescene.js, mockdata.js, firecontrl.js, test文件，不扫描
        // 后续如果有其他文件要过滤，可以手动添加
        if (
            file.name.match(/src\/assets/gi) ||
            file.name.match(/src\/locale/gi) ||
            file.name.match(/webSocketClient\.ts/gi) ||
            file.name.match(/src\/api\/assetService/gi) ||
            file.name.match(/mock\.js$/gi) ||
            file.name.match(/src\/views\/GraphMVC/gi) ||
            file.name.match(/src\/router/gi) ||
            file.name.match(/src\/demo/gi) ||
            file.name.match(/src\/views\/machine-room-safety\/floor-map\/constant/gi) ||
            file.name.match(/templatescene\.js$/gi) ||
            file.name.match(/mockdata\.js$/gi) ||
            file.name.match(/mockdata$/gi) ||
            file.name.match(/videoPlayer\.js/gi) ||
            file.name.match(/firecontrol\.js$/gi) ||
            file.name.match(/src\/views\/test/gi)
        ) {
            return;
        }
        // 文件的绝对路径
        const p = path.join(dir, file.name);
        // 文件的类型
        const basename = getJsFileBasename(file.name);
        // 判断是否是文件
        if (file.isFile()) {
            // 如果是jpg，svg，json, md, wasm等静态文件，不扫描
            // 后续可以手动添加其他不需要扫描的文件类型
            if (
                !['jpg', 'jpeg', 'png', 'less', 'json', 'gif', 'svg', 'md', 'wasm'].includes(basename) &&
                !file.name.match(/min\.js$/gi) // 如果是编译过的min.js文件，不扫描
            ) {
                // 读取文件内容
                const fr = fs.readFileSync(p, {
                    encoding: 'utf-8'
                });
                const keys = fr.match(/i18n\.global\.t\(\s*'[^']+'/gi);
                if (keys) {
                    for (let ky of keys) {
                        const key = ky.match(/'([^']+)'/);
                        if (key[1] && !validKey.includes(key[1])) {
                            console.log(key[1], p);
                        }
                    }
                }
                const keys2 = fr.match(/i18n\.global\.t\(\s*"[^"]+"/gi);
                if (keys2) {
                    for (let ky of keys2) {
                        const key = ky.match(/"([^"]+)"/);
                        if (key[1] && !validKey.includes(key[1])) {
                            console.log(key[1], p);
                        }
                    }
                }
            }
            // 如果是目录，递归
        } else if (file.isDirectory()) {
            await scanDir(p);
        }
    }
};
async function main() {
    for (let key in zhLocale) {
        for (let secondKey in zhLocale[key]) {
            if (typeof zhLocale[key][secondKey] == 'string') {
                zhmap[zhLocale[key][secondKey]] = `${key}.${secondKey}`;
                validKey.push(`${key}.${secondKey}`);
            } else {
                for (let thirdkey in zhLocale[key][secondKey]) {
                    if (typeof zhLocale[key][secondKey][thirdkey] == 'string') {
                        zhmap[zhLocale[key][secondKey][thirdkey]] = `${key}.${secondKey}.${thirdkey}`;
                        validKey.push(`${key}.${secondKey}.${thirdkey}`);
                    }
                }
            }
        }
    }
    const dir = process.argv[process.argv.length - 1];
    // 执行扫描
    await scanDir(dir);
    const worksheet = XLSX.utils.json_to_sheet(already);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet4');
    await XLSX.writeFileSync(workbook, path.join(`./output/无效key结果${new Date().getTime()}.xlsx`), {});
}

main();
