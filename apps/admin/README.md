# FORIF Admin

운영진이 회원, 스터디, 공지, 수료증 등 운영 업무를 관리하는 서비스입니다.

## 실행

저장소 루트에서 실행합니다.

```bash
pnpm dev --filter=admin
```

개발 서버는 기본적으로 http://localhost:3001 에서 실행됩니다.

## 환경 변수

`apps/admin/.env.example`을 `apps/admin/.env.local`로 복사한 뒤 값을 설정합니다. 변수 이름과
유효성 규칙은 [`src/env.ts`](src/env.ts)를 기준으로 확인합니다.

## 검증

```bash
pnpm lint --filter=admin
pnpm type-check --filter=admin
pnpm test --filter=admin
pnpm build --filter=admin
```

환경 변수와 API 계약을 바꾸기 전에는 루트의
[기여 가이드](../../CONTRIBUTING.md)와 [FORIF Scalar](https://dev.forif.org/scalar)를
확인하세요.
