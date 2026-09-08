# Admin 작업 지침

관리자 앱의 공통 작업 규칙은 루트 [CLAUDE.md](../../CLAUDE.md)와
[CONTRIBUTING.md](../../CONTRIBUTING.md)를 따릅니다.

- 개발 서버: `pnpm dev --filter=admin` (포트 3001)
- 전체 검증: `pnpm lint`, `pnpm type-check`, `pnpm test`
- 앱 범위 검증: `pnpm lint --filter=admin`, `pnpm type-check --filter=admin`,
  `pnpm test --filter=admin`
- API 경로·인증·필드 계약: [FORIF Scalar](https://dev.forif.org/scalar)

관리자 전용 UI는 `apps/admin/src`에 두고, web과 공유되는 UI만
`packages/ui`에 둡니다.
