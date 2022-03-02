module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // 功能
        "fix", // bug
        "test", // 测试
        "perf", // 优化
        "refactor", // 重构
        "docs", // 文档
        "chore", // 辅助工具配置
        "style", // 格式 （适合lint fix...）
        "revert", // 回滚
        "merge", // 合并
        "sync", // 同步（同步主线或分支上的fix修复等）
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "scope-empty": [0],
    "scope-case": [0],
    "subject-full-stop": [0, "never"],
    "subject-case": [0, "never"],
    "header-max-length": [0, "always", 72],
  },
};
