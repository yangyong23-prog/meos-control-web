module.exports = {
  rules: {
    '@typescript-eslint/class-literal-property-style': ['error'],
    '@typescript-eslint/consistent-type-assertions': [
      'warn',
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'never'
      }
    ],
    '@typescript-eslint/explicit-member-accessibility': ['warn'],
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'public-static-field',
          'protected-static-field',
          'private-static-field',
          'static-field',
          'public-static-method',
          'protected-static-method',
          'private-static-method',
          'static-method',
          'public-instance-field',
          'protected-instance-field',
          'private-instance-field',
          'public-field',
          'protected-field',
          'private-field',
          'instance-field',
          'field',
          'constructor',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method',
          'public-method',
          'protected-method',
          'private-method',
          'instance-method',
          'method'
        ]
      }
    ],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-inferrable-types': ['warn'],
    '@typescript-eslint/no-namespace': [
      'error',
      {
        allowDeclarations: true,
        allowDefinitionFiles: true
      }
    ],
    '@typescript-eslint/no-require-imports': ['error'],
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
        enforceForJSX: false
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true
      }
    ],
    '@typescript-eslint/no-useless-constructor': ['warn'],
    '@typescript-eslint/prefer-for-of': ['warn'],
    '@typescript-eslint/prefer-function-type': ['warn'],
    '@typescript-eslint/prefer-namespace-keyword': ['error'],
    '@typescript-eslint/prefer-optional-chain': ['error'],
    '@typescript-eslint/triple-slash-reference': [
      'error',
      {
        lib: 'always',
        path: 'never',
        types: 'always'
      }
    ],
    '@typescript-eslint/typedef': ['error'],
    '@typescript-eslint/unified-signatures': ['error'],
    'array-callback-return': ['warn'],
    'arrow-body-style': ['warn', 'as-needed'],
    'block-scoped-var': ['error'],
    'capitalized-comments': ['error'],
    'class-methods-use-this': ['error'],
    complexity: ['error'],
    'consistent-return': ['error'],
    'consistent-this': ['error'],
    curly: ['error', 'all'],
    'default-case': ['error'],
    'for-direction': ['error'],
    'func-names': ['error'],
    'getter-return': ['error'],
    'guard-for-in': ['error'],
    'id-denylist': ['error'],
    'id-length': ['error'],
    'id-match': ['error'],
    'init-declarations': ['error'],
    'max-depth': ['error'],
    'max-len': [
      'error',
      {
        code: 180,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true
      }
    ],
    'max-lines': ['off'],
    'max-nested-callbacks': ['error'],
    'max-params': ['error'],
    'max-statements': ['off'],
    'max-statements-per-line': ['error'],
    'no-array-constructor': ['error'],
    'no-bitwise': ['error'],
    'no-confusing-arrow': ['error', { allowParens: false }],
    // 'no-console': ['error'],
    'no-constant-condition': ['error'],
    'no-continue': ['error'],
    'no-dupe-else-if': ['error'],
    'no-else-return': [
      'error',
      {
        allowElseIf: false
      }
    ],
    'no-eval': [
      'error',
      {
        allowIndirect: true
      }
    ],
    'no-inner-declarations': ['error'],
    'no-iterator': ['warn'],
    'no-loop-func': ['error'],
    'no-mixed-operators': [
      'error',
      {
        groups: [
          ['%', '**'],
          ['%', '+'],
          ['%', '-'],
          ['%', '*'],
          ['%', '/'],
          ['&', '|', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!=='],
          ['&&', '||'],
          ['*', '/']
        ],
        allowSamePrecedence: false
      }
    ],
    'no-multi-assign': ['error'],
    'no-nested-ternary': ['error'],
    'no-new-wrappers': ['warn'],
    'no-nonoctal-decimal-escape': ['error'],
    'no-param-reassign': [
      'warn',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'acc',
          'accumulator',
          'e',
          'ctx',
          'req',
          'request',
          'res',
          'response',
          '$scope',
          'staticContext',
          'state'
        ]
      }
    ],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true
      }
    ],
    'no-redeclare': ['error'],
    'no-restricted-globals': ['error'],
    'no-restricted-properties': [
      'error',
      {
        object: 'Math',
        property: 'pow',
        message: 'Please use ** instand'
      }
    ],
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
      },
      {
        selector: 'ForOfStatement',
        message:
          'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.'
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
      }
    ],
    'no-return-await': ['error'],
    'no-self-compare': ['error'],
    'no-sequences': ['error'],
    'no-setter-return': ['error'],
    'no-shadow': ['error'],
    'no-undefined': ['error'],
    'no-underscore-dangle': ['error'],
    'no-unneeded-ternary': ['error'],
    'no-unsafe-optional-chaining': ['error'],
    'no-unused-expressions': ['off'],
    'no-unused-labels': ['error'],
    'no-useless-constructor': ['off'],
    'no-var': ['error'],
    'object-shorthand': ['error'],
    'one-var': ['warn', 'never'],
    'prefer-arrow-callback': ['error'],
    'prefer-destructuring': [
      'warn',
      {
        VariableDeclarator: {
          array: false,
          object: true
        },
        AssignmentExpression: {
          array: true,
          object: false
        }
      },
      {
        enforceForRenamedProperties: false
      }
    ],
    'prefer-rest-params': ['error'],
    'prefer-spread': ['warn'],
    'prefer-template': ['error'],
    radix: ['error'],
    'require-yield': ['error'],
    'use-isnan': ['error'],
    'valid-typeof': ['error'],
    'vue/attribute-hyphenation': ['error'],
    'vue/attributes-order': ['error'],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any'
        }
      }
    ],
    'vue/max-len': [
      'error',
      {
        code: 180,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true
      }
    ],
    'vue/multi-word-component-names': ['off'],
    'vue/no-template-shadow': ['error'],
    'vue/no-v-html': ['error'],
    'vue/prop-name-casing': ['error'],
    'vue/require-default-prop': ['error'],
    'vue/this-in-template': ['error'],
    'vue/v-bind-style': ['error'],
    'vue/v-on-style': ['error']
  }
}
