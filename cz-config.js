const fs = require("fs");
const path = require("path");

const packages = fs.readdirSync(path.resolve(__dirname, "packages"));
const apps = fs.readdirSync(path.resolve(__dirname, "apps"));

module.exports = {
  types: [
    {
      value: "feat",
      name: "✨ feat:\t새로운 기능 추가",
    },
    { value: "🐛 fix", name: "🐛 fix:\t버그 수정" },
    {
      value: "docs",
      name: "📝 docs:\t문서 추가/수정/삭제",
    },
    {
      value: "style",
      name: "🎨 style:\t코드 포맷 변경, 세미 콜론 누락, 의미 없는 코드 수정",
    },
    {
      value: "design",
      name: "💄 design:\tUI 디자인 변경 (CSS 등)",
    },
    {
      value: "refactor",
      name: "♻️ refactor:\t코드 리팩토링",
    },
    {
      value: "perf",
      name: "⚡️ perf:\t성능 개선을 위한 코드 수정",
    },
    {
      value: "test",
      name: "✅ test:\t테스트 케이스 추가/수정/삭제",
    },
    {
      value: "chore",
      name: "🚚 chore:\t빌드 업데이트 혹은 사소한 수정",
    },
    {
      value: "wip",
      name: "🚧 wip:\t코드가 완성되지 않았지만 진행 상황을 저장",
    },
    {
      value: "build",
      name: "👷 build:\t빌드 파일 수정",
    },
    {
      value: "ci",
      name: "💚 ci:\tCI 설정 파일 수정",
    },
  ],

  messages: {
    type: "커밋 유형을 선택해주세요.\n",
    scope: "\n변경사항의 범위(scope)를 선택해주세요:",
    // used if allowCustomScopes is true
    customScope: "변경사항의 범위(scope)를 직접 입력해주세요::\n",
    subject: "커밋제목을 50자 이내로 명확하게 작성해주세요.\n",
    body: '본문을 작성 해주세요. 여러줄 작성시 "|" 를 사용하여 줄바꿈하세요. (첫줄|둘째줄):\n',
    confirmCommit: "모든 커밋메시지를 제대로 입력하셨나요? (y | n)",
  },

  scopes: [...apps, ...packages],
  scopeOverrides: {
    fix: [
      { name: "merge" },
      { name: "style" },
      { name: "test" },
      { name: "hotfix" },
    ],
  },

  allowCustomScopes: true,
  // skip any questions you want
  skipQuestions: ["breaking", "footer"],
  subjectLimit: 100,
};
