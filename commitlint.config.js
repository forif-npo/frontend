module.exports = {
  extends: [
    "@commitlint/config-conventional",
    "@commitlint/config-pnpm-scopes",
  ],
  /**
   * Custom parser to allow an emoji (gitmoji) as the commit type.
   * Matches either:
   *  - One or more emoji characters as type
   *  - or classic (word) types (fallback) consisting of word chars
   * Pattern captures: type, optional scope, subject
   */
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^([\p{Emoji_Presentation}\p{Emoji}\p{Extended_Pictographic}]+|\w+)(?:\(([^)]+)\))?!?: (.+)$/u,
      headerCorrespondence: ["type", "scope", "subject"],
    },
  },
  rules: {
    // Allow either the gitmoji itself
    "type-enum": [
      2,
      "always",
      [
        // gitmoji set
        "🚀", // feat
        "🐛", // fix
        "📝", // docs
        "🎨", // style (formatting)
        "💄", // design (UI changes)
        "♻️", // refactor
        "⚡️", // perf
        "✅", // test
        "🚚", // chore / move
        "🚧", // wip
        "👷", // build
        "💚", // ci
      ],
    ],
  },
  ignores: [
    (commitMessage) => {
      // allow GitHub merge commits
      return /^Merge branch '.*' into [a-zA-Z0-9\/\-_]+$/.test(commitMessage);
    },
  ],
};
