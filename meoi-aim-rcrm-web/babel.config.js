module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [
        '@vue/babel-plugin-jsx'
        // [
        //     'import',
        //     {
        //         libraryName: 'meri-plus',
        //         styleLibraryDirectory: 'style',
        //         style: name => {
        //             console.log('name>>>>>>>>>>', name);
        //             const cssName = name.toLowerCase();
        //             return `style/${cssName}/index.css`;
        //         }
        //     }
        // ]
    ]
};
