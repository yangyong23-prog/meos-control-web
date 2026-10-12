module.exports = {
    extends: ['stylelint-config-standard', 'stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss'],
    plugins: ['stylelint-order'],
    overrides: [
        {
            files: ['**/*.(scss|css|html|vue)'],
            customSyntax: 'postcss-scss'
        },
        {
            files: ['**/*.(html|vue)'],
            customSyntax: 'postcss-html'
        }
    ],
    ignoreFiles: [
        '**/*.js',
        '**/*.jsx',
        '**/*.tsx',
        '**/*.ts',
        '**/*.json',
        '**/*.md',
        '**/*.svg',
        '**/*.png',
        '**/*.gif',
        '**/*.ttf',
        '**/*.styl',
        '**/*.ico',
        '**/*.jpg'
    ],
    rules: {
        'font-family-no-missing-generic-family-keyword': null,
        'import-notation': null,
        indentation: 4,
        'unit-no-unknown': [true, { ignoreUnits: ['/rpx/', '/upx/'] }],
        'no-descending-specificity': null,
        'function-url-quotes': 'always',
        'string-quotes': 'single',
        'unit-case': null,
        'color-hex-case': 'lower',
        'color-hex-length': 'long',
        'rule-empty-line-before': 'never',
        'font-family-no-missing-generic-family-keyword': null,
        'block-opening-brace-space-before': 'always',
        'property-no-unknown': null,
        'no-empty-source': null,
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['deep']
            }
        ],
        'at-rule-no-unknown': null,
        'declaration-block-trailing-semicolon': null,
        'property-no-vendor-prefix': null,
        'max-line-length': null
    }
};
