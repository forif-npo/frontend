# 온보딩

## 프로젝트 구성

- `apps/web`: 부원·멘토용 서비스, 기본 포트 `3000`
- `apps/admin`: 운영진 관리 서비스, 기본 포트 `3001`
- `packages/core`: 공통 도메인 타입·스키마·유틸리티
- `packages/ui`: 공통 UI와 디자인 토큰

## 시작하기

저장소 루트에서 pnpm을 사용합니다.

```bash
pnpm install
pnpm dev --filter=web
pnpm dev --filter=admin
```

환경 변수는 각 앱의 `.env.example`을 `.env.local`로 복사해 설정합니다. 비밀 값은
저장소, PR, 스크린샷, 채팅에 공유하지 않습니다. 변수 이름과 유효성 규칙은 각 앱의
`src/env.ts`를 기준으로 확인합니다.

## 기본 확인 명령

병합 전 전체 확인은 아래 명령을 사용합니다.

```bash
pnpm lint
pnpm type-check
pnpm test
```

빌드·배포 설정, 환경 변수, Next.js 설정, 공통 패키지를 변경했다면 `pnpm build`도
실행합니다. 변경 범위가 한 앱이나 패키지에 한정되면 해당 workspace 명령으로 먼저
확인하고, PR 전에 전체 검증을 실행합니다.
