module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "standard",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "array-bracket-spacing": [2, "never"],
    "comma-dangle": [2, "always-multiline"],
    "import/order": [
      2,
      {
        pathGroups: [
          {pattern: "react", group: "external", position: "before"},
          {pattern: "next{,/**}", group: "external", position: "before"},
          {pattern: "{,@}xstate{,/**}", group: "external", position: "before"},
          {
            pattern: "{,react-,next-}i18next",
            group: "external",
            position: "before",
          },
          {
            pattern:
              "@material-ui/{core,icons,lab,pickers}{,/!(styles|colors)*}",
            group: "external",
            position: "before",
          },
          {
            pattern: "@material-ui/{core/styles,styles}{,/*}",
            group: "external",
            position: "before",
          },
          {
            pattern: "@material-ui/core/colors{,/*}",
            group: "external",
            position: "before",
          },
          {
            pattern: "{color,clsx}",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["unknown"],
        "newlines-between": "always",
        alphabetize: {order: "asc"},
      },
    ],
    "object-curly-spacing": [2, "never"],
    "react/jsx-curly-brace-presence": [2, {props: "always", children: "never"}],
    "react/jsx-sort-props": [
      2,
      {
        callbacksLast: true,
        shorthandLast: true,
        ignoreCase: true,
        reservedFirst: true,
      },
    ],
    "react/react-in-jsx-scope": 0,
    "sort-imports": [
      2,
      {
        ignoreDeclarationSort: true,
        memberSyntaxSortOrder: ["all", "single", "multiple", "none"],
      },
    ],
    quotes: [2, "double"],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
}
