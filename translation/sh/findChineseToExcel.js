import fs from 'fs';
import XLSX from 'xlsx'; // excel生成库
import _ from 'lodash';
import path from 'path';
const already = {};
const workbook = XLSX.utils.book_new();
const rows = [];
const feiqi = [];
// 获取文件类型
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
            continue;
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
                // 按照回车分成一行行的文本数组
                const lines = fr.split(/\r?\n/);
                for (let i = 0; i < lines.length; i++) {
                    // 每一行进行判断
                    const r = lines[i];

                    // 查找这一行中是否存在中文，还有中文相关的标点
                    if (r.match(/[\u4e00-\u9fa5，。！：、？]+/gi)) {
                        // 匹配中文与同一行前后的1000个字符，因为有些行中文是夹杂英文数字的
                        const res = r.match(/[^\r\n]{0,1000}([\u4e00-\u9fa5，。！：、？]+)[^\r\n]{0,1000}/gi);
                        for (let line of res) {
                            // 一行行检查
                            if (
                                !line.match(/\/\/[\s\S]*[\u4e00-\u9fa5]+/) && // 如果这一行是// 注释，略过不扫
                                !line.match(/\*[\s\S]*[\u4e00-\u9fa5]+/) && // 如果是 /*开头的注释，略过
                                !line.match(/console\.warn(.+)/gi) && // 如果是warn打印，略过
                                !line.match(/console\.log(.+)/gi) && // 如果是log打印，略过
                                !line.match(/console\.error(.+)/gi) && // 如果是error打印，略过
                                !line.match(/\<\!\-\-.+\-\-\>/gi) // 如果是<!-- -->注视，略过
                            ) {
                                // 匹配一行内的每一个中文
                                const words = line.match(/[\u4e00-\u9fa5]+[\d\（\）\-，～%\.。！：、/？]*[\u4e00-\u9fa5]*/gi);
                                if (words) {
                                    // 写入excel
                                    for (let word of words) {
                                        if (already[p] && already[p].includes(i + 1)) {
                                            continue;
                                        }
                                        rows.push({
                                            'key(指示代号）': p.replace(/[\/\.]/gi, ''), // 唯一的key
                                            中文: word, // 具体的中文
                                            英文翻译: '', // 英文翻译
                                            代码上下文: line, // 本行代码具体内容
                                            行号: i + 1, // 所在行号
                                            文件位置: p // 文件位置
                                        });
                                        if (already[p]) {
                                            already[p].push(i + 1);
                                        } else {
                                            already[p] = [i + 1];
                                        }
                                    }
                                }
                            } else {
                                // 打印那些被忽略的注释，打印中的中文，方面后续人工排查
                                feiqi.push({
                                    deprecated: line,
                                    行号: i + 1,
                                    文件位置: p
                                });
                            }
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
    // 从命令行获取需要扫描的目录
    const dir = process.argv[process.argv.length - 1];
    // 执行扫描
    await scanDir(dir);
    // 生成excel
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const worksheet1 = XLSX.utils.json_to_sheet(feiqi);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');
    XLSX.utils.book_append_sheet(workbook, worksheet1, '废弃');
    const mulu = dir.replace(/\//gi, '_').replace(/\./gi, '');
    await XLSX.writeFileSync(workbook, path.join(`./output/中文扫描结果_${mulu}_${new Date().getTime()}.xlsx`), {});
}

main();
