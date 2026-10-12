const fs = require('fs');
const path = require('path');

// 读取环境变量的文件把它转化成对象
const readEnv = function parseFileToJSON(file) {
    try {
        const data = fs.readFileSync(path.resolve(__dirname, file), 'utf8');
        const lines = data.split('\n');
        const result = {};

        lines.forEach(line => {
            const trimmedLine = line.trim();

            if (trimmedLine !== '' && !trimmedLine.startsWith('#')) {
                const commentIndex = trimmedLine.indexOf('#');
                const lineWithoutComment =
                    commentIndex !== -1 ? trimmedLine.slice(0, commentIndex).trim() : trimmedLine;
                const [key, value] = lineWithoutComment.split('=');

                const trimmedKey = key.trim();
                const trimmedValue = value.trim();

                result[trimmedKey] = trimmedValue;
            }
        });

        return result;
    } catch (e) {
        console.warn(e);
        return {};
    }
};
module.exports = { readEnv };
