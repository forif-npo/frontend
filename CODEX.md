# Codex 작업 보충 지침

Codex는 [AGENTS.md](AGENTS.md)와 [REFACTORING.md](REFACTORING.md)를 먼저 읽고
작업합니다.

## 실행

- 파일 편집에는 patch 기반 변경을 사용합니다.
- 변경 범위에 맞는 검증을 먼저 실행하고, 병합 후보에는 `pnpm lint`,
  `pnpm type-check`, `pnpm test`를 실행합니다.
- 빌드·배포 설정 변경에는 `pnpm build`를 실행합니다.
- `pre-commit` 훅은 staged 파일에 Prettier와 ESLint를 실행합니다.
- `pnpm commit`은 커밋 메시지 도우미입니다. 커밋 제목 형식 검증 훅은 없습니다.

## 작업 문서

- 개발·검증·PR 절차: [CONTRIBUTING.md](CONTRIBUTING.md)
- web 앱: [apps/web/README.md](apps/web/README.md)
- admin 앱: [apps/admin/README.md](apps/admin/README.md)
