# Codex 작업 보충 지침

Codex는 [AGENTS.md](AGENTS.md), [REFACTORING.md](REFACTORING.md),
[GIT_WORKFLOW.md](GIT_WORKFLOW.md)를 먼저 읽고 작업합니다.

## 실행

- 파일 편집에는 patch 기반 변경을 사용합니다.
- 변경 범위에 맞는 검증을 먼저 실행하고, 병합 후보에는 `pnpm lint`,
  `pnpm type-check`, `pnpm test`를 실행합니다.
- UI 작업에서는 [DESIGN_REVIEW.md](DESIGN_REVIEW.md)를 읽고, 실행 가능한 화면을
  browser로 관찰해 디자인 검토 근거를 남깁니다.
- 빌드·배포 설정 변경에는 `pnpm build`를 실행합니다.
- `pre-commit` 훅은 staged 파일에 Prettier와 ESLint를 실행합니다.
- `pnpm commit`은 커밋 메시지 도우미입니다. 커밋 제목 형식 검증 훅은 없습니다.

## 작업 문서

- 개발·검증·PR 절차: [CONTRIBUTING.md](CONTRIBUTING.md)
- 브랜치·배포 절차: [GIT_WORKFLOW.md](GIT_WORKFLOW.md)
- web 앱: [apps/web/README.md](apps/web/README.md)
- admin 앱: [apps/admin/README.md](apps/admin/README.md)
