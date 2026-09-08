# FORIF Web

부원과 멘토가 사용하는 FORIF 웹 서비스입니다.

## 실행

저장소 루트에서 실행합니다.

```bash
pnpm dev --filter=web
```

개발 서버는 기본적으로 http://localhost:3000 에서 실행됩니다.

## 환경 변수

`apps/web/.env.example`을 `apps/web/.env.local`로 복사한 뒤 값을 설정합니다. 변수 이름과
유효성 규칙은 [`src/env.ts`](src/env.ts)를 기준으로 확인합니다.

## 검증

```bash
pnpm lint --filter=web
pnpm type-check --filter=web
pnpm test --filter=web
pnpm build --filter=web
```

환경 변수와 API 계약을 바꾸기 전에는 루트의
[기여 가이드](../../CONTRIBUTING.md)와 [FORIF Scalar](https://dev.forif.org/scalar)를
확인하세요.
