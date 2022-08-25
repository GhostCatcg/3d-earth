module.exports = {
  "plugins": ['@typescript-eslint'],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    eqeqeq: 0, // 必须使用全等
    'no-unused-vars': 1, // 不能有声明后未被使用的变量或参数
    'no-throw-literal': 0, // 0可以/2不可以 抛出字面量错误 throw "error";
    'no-sparse-arrays': 2, // 数组中不允许出现空位置
    'no-empty': 0, // 禁止出现空语句块
    'no-console': ['error', { allow: ['warn', 'error', 'info', "log"] }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-useless-escape': 0,
    "@typescript-eslint/no-explicit-any": "off",
    "no-async-promise-executor": 0
  },
}
