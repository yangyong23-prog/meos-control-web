// import path from 'path';
// import fs from 'fs';

const path = require('path');
const fs = require('fs');

// 获取文件夹下所有文件多语言文件
const getLanguageResourceFiles = targetPath => {
    const files = fs.readdirSync(targetPath);
    const languageFiles = files
        .filter(file => {
            return file.endsWith('.json');
        })
        .map(file => {
            return { fullPath: path.join(targetPath, file), name: file };
        });

    return languageFiles;
};

/**
 * @param {*} localFrom  多语系源文件所在地址
 * @param {*} localeTo   多语系文件写入地址
 * @param {*} projectKeys 数组， 源文件中需要写入localeTo的字串分组
 */
function run(localFrom, localeTo, projectKeys) {
    const languageFiles = getLanguageResourceFiles(path.join(localFrom, 'langs'));

    function replacePlaceholder(target) {
        const keys = Object.keys(target);
        keys.forEach(key => {
            if (typeof target[key] === 'string') {
                target[key] = target[key].replace('<!--不要修改这个字串--!>', '');
            } else {
                target[key] = replacePlaceholder(target[key]);
            }
        });
        return target;
    }

    languageFiles.forEach(file => {
        const { fullPath, name } = file;
        const localeFile = fs.readFileSync(fullPath, 'utf-8');
        const localeJson = JSON.parse(localeFile);
        const localeKeys = Object.keys(localeJson);
        const localeObj = {};

        localeKeys.forEach(key => {
            if (!projectKeys || !projectKeys.length || projectKeys.includes(key)) {
                // 去除字串中 提示字串
                localeJson[key] = replacePlaceholder(localeJson[key]);
                localeObj[key] = localeJson[key];
            }
        });
        const localeStr = JSON.stringify(localeObj, null, 4);
        if (!fs.existsSync(localeTo)) {
            fs.mkdirSync(localeTo, { recursive: true });
        }
        fs.writeFileSync(path.join(localeTo, name), localeStr);
    });
}

const LanguageManager = {
    run
};

module.exports = LanguageManager;
