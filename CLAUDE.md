# Claude Code 작업 보충 지침

Claude Code는 [AGENTS.md](AGENTS.md), [REFACTORING.md](REFACTORING.md),
[GIT_WORKFLOW.md](GIT_WORKFLOW.md)를 먼저 읽고 작업합니다.

## 실행

- 변경 범위에 맞는 검증을 먼저 실행하고, 병합 후보에는 `pnpm lint`,
  `pnpm type-check`, `pnpm test`를 실행합니다.
- 빌드·배포 설정 변경에는 `pnpm build`를 실행합니다.
- 앱별 실행과 환경 변수 설정은 각 앱 README를 확인합니다.

## 작업 문서

- 개발·검증·PR 절차: [CONTRIBUTING.md](CONTRIBUTING.md)
- 브랜치·배포 절차: [GIT_WORKFLOW.md](GIT_WORKFLOW.md)
- web 앱: [apps/web/README.md](apps/web/README.md)
- admin 앱: [apps/admin/README.md](apps/admin/README.md)
