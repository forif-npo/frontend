# FORIF Frontend Copilot 지침

코드 제안과 변경은 [AGENTS.md](../AGENTS.md),
[REFACTORING.md](../REFACTORING.md), [GIT_WORKFLOW.md](../GIT_WORKFLOW.md)를
기준으로 작성합니다.

## 저장소 구조

- `apps/web`: 부원·멘토용 서비스
- `apps/admin`: 운영진 관리 서비스
- `packages/core`: 공통 타입, 스키마, 도메인 유틸리티
- `packages/ui`: web과 admin에서 재사용 근거가 있는 UI
- `packages/*-config`: 공유 ESLint, TypeScript, Tailwind 설정

앱은 패키지를 사용할 수 있으며, 패키지는 앱에 의존하지 않습니다.

## 구현 기준

- TypeScript, Next.js 15, React 19, Tailwind CSS와 기존 컴포넌트·토큰을 사용합니다.
- 사용자 동작, 화면 출력, 접근성 의미, 권한, 데이터 형식, API 계약을 유지합니다.
- UI는 `@repo/ui`와 앱 전용 primitive를 먼저 검토하고, 재사용 근거가 있는 경우에만
  `packages/ui` 확장을 제안합니다.
- 순수 변환, 유효성 검사, API payload 조립은 명확한 책임 경계로 분리합니다.
- API 계약은 [FORIF Scalar](https://dev.forif.org/scalar)와 실제 타입 정의를 함께
  확인하며, 백엔드 필드는 `snake_case`로 작성합니다.
- 테스트는 사용자 동작과 데이터 경계의 계약을 검증합니다.

## 검증과 Git

- 변경 범위에 맞는 테스트와 타입 검사를 실행하고, 병합 후보는 `pnpm lint`,
  `pnpm type-check`, `pnpm test`를 실행합니다.
- 빌드 또는 배포 설정 변경에는 `pnpm build`를 실행합니다.
- 커밋 메시지 작성은 `pnpm commit`을 사용할 수 있습니다.
- 브랜치 생성, stage, commit, push, merge는 작업 요청 범위와
  [GIT_WORKFLOW.md](../GIT_WORKFLOW.md)를 따릅니다.
