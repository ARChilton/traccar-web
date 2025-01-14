module.exports = {
  extends: 'airbnb',
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: [
    'react',
  ],
  ignorePatterns: ['build/', 'switcher.js', 'theme.js'],
  rules: {
    'import/prefer-default-export': 'off',
    'max-len': [0],
    'no-shadow': [0],
    'no-return-assign': [0],
    'no-param-reassign': [0],
    'no-prototype-builtins': [0],
    'object-curly-newline': [1, {
      ObjectExpression: { minProperties: 8, multiline: true, consistent: true },
      ObjectPattern: { minProperties: 8, multiline: true, consistent: true },
      ImportDeclaration: { minProperties: 4, multiline: true, consistent: true },
      ExportDeclaration: { minProperties: 4, multiline: true, consistent: true },
    }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/function-component-definition': [
      1,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/prop-types': [0],
    'react/jsx-props-no-spreading': [0],
    'jsx-a11y/anchor-is-valid': [0],
    'linebreak-style': 0,
    semi: 0,
    'import/no-relative-packages': 0,
    'import-order': [
      'off',
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: false,
      },
    ],
  },
}
