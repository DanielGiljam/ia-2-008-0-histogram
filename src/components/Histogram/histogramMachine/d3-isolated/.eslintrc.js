module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ["standard"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  root: true,
  rules: {
    "array-bracket-spacing": [2, "never"],
    "comma-dangle": [2, "always-multiline"],
    "import/order": [
      2,
      {
        pathGroups: [
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
    "sort-imports": [
      2,
      {
        ignoreDeclarationSort: true,
        memberSyntaxSortOrder: ["all", "single", "multiple", "none"],
      },
    ],
    quotes: [2, "double"],
  },
}
