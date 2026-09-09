# FORIF Frontend

한양대학교 중앙 개발 동아리 FORIF의 프론트엔드 모노레포입니다. pnpm workspace와
Turborepo로 web과 admin 앱, 공통 패키지를 함께 관리합니다.

## 빠른 시작

```bash
pnpm install
pnpm dev --filter=web
pnpm dev --filter=admin
```

- web: http://localhost:3000
- admin: http://localhost:3001

## 구성

- `apps/web`: 부원·멘토용 서비스
- `apps/admin`: 운영진 관리 서비스
- `packages/core`: 공통 도메인 타입·스키마·유틸리티
- `packages/ui`: 공통 UI 컴포넌트
- `packages/*-config`: 공유 도구 설정

## 주요 명령

```bash
pnpm dev --filter=web
pnpm dev --filter=admin
pnpm lint
pnpm type-check
pnpm test
pnpm build
pnpm storybook
```

## 문서

- [기여 가이드](CONTRIBUTING.md): 검증, 커밋, PR, API 계약 기준
- [Git 작업·배포 흐름](GIT_WORKFLOW.md): 브랜치, PR 승격, 배포와 hotfix 기준
- [web 안내](apps/web/README.md)
- [admin 안내](apps/admin/README.md)
- [Codex 지침](CODEX.md)
- [Claude Code 지침](CLAUDE.md)
- [리팩토링 운영 기준](REFACTORING.md)
- [저장소 구조와 명명 규칙](ARCHITECTURE.md): 디렉터리 책임, 의존성 방향, 파일 명명 기준
- [공유 캘린더](packages/big-calendar/README.md)
- [공유 ESLint 설정](packages/eslint-config/README.md)
- [공유 TypeScript 설정](packages/typescript-config/README.md)
- [공유 Tailwind 설정](packages/tailwind-config/README.md)

최신 API 계약은 [FORIF Scalar](https://dev.forif.org/scalar)를 확인하세요.
