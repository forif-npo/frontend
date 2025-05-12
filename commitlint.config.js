module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "wip",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "design",
        "style",
        "test",
      ],
    ],
  },
  ignores: [
    (commitMessage) => {
      // add an exception for github
      return /^Merge branch '.*' into [a-zA-Z0-9\/\-_]+$/.test(commitMessage);
    },
  ],
};
