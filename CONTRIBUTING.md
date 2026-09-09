# 기여 가이드

## 시작하기

이 저장소는 pnpm workspace와 Turborepo를 사용합니다. 루트의
[`package.json`](package.json)에 선언된 pnpm 버전을 사용하세요.

```bash
pnpm install
pnpm dev --filter=web
pnpm dev --filter=admin
```

각 앱의 역할과 실행 방법은 [web 안내](apps/web/README.md) 및
[admin 안내](apps/admin/README.md)를 확인합니다.

## 환경 변수

환경 변수는 각 앱의 템플릿을 복사해 설정합니다. 비밀 값은 로컬 환경 또는 배포 플랫폼의
환경 변수 관리 기능으로 제공합니다.

```powershell
Copy-Item apps/web/.env.example apps/web/.env.local
Copy-Item apps/admin/.env.example apps/admin/.env.local
```

web은 Google 로그인, 인증 비밀값, 백엔드 서버 URL, 카카오맵 키를 사용합니다. admin은
인증 비밀값, 앱·백엔드 URL, Google Calendar 서비스 계정 값을 사용합니다. 전체 변수 목록과
유효성 규칙은 `apps/web/src/env.ts`, `apps/admin/src/env.ts`를 기준으로 확인합니다.

## 검증 기준

변경 범위에 맞는 검증을 먼저 실행하고, 병합 전에는 아래 전체 검증을 실행합니다.

```bash
pnpm lint
pnpm type-check
pnpm test
```

빌드 또는 배포 설정을 바꿨다면 `pnpm build`도 실행합니다.

Husky의 `pre-commit` 훅은 staged 파일에 Prettier와 ESLint를 실행합니다. 타입 검사,
테스트, 프로덕션 빌드는 위 전체 검증 명령으로 실행합니다.

## 커밋과 PR

커밋 메시지에는 변경 의도를 작성합니다. `pnpm commit`은 이모지와 범위를 선택하는
대화식 도우미입니다. 직접 커밋도 사용할 수 있습니다.

PR에는 다음을 적습니다.

- 변경한 앱 또는 패키지 범위
- 사용자 동작이나 API 계약에 미치는 영향
- 실행한 검증 명령과 수동 확인 방법
- 남아 있는 위험, 후속 작업 또는 검토가 필요한 판단

PR 검증과 배포 검증은 로컬 전체 검증, Vercel Preview, 릴리즈 게이트로 관리합니다.

## Git 작업·배포 흐름

브랜치 역할, 작업 브랜치 접두사, PR 대상, 긴급 수정, 실제 배포 절차는
[GIT_WORKFLOW.md](GIT_WORKFLOW.md)를 기준으로 관리합니다.

일반 작업은 `dev`에서 분기해 `dev`로 PR을 생성합니다. 배포 후보는 `dev`에서
`release`로 승격하고, 실제 배포 확인을 마친 내용은 `main`에 기록합니다. 운영 서비스의
긴급 수정은 `release`에서 분기한 `hotfix/*`로 처리합니다.

## API 계약

API 경로·인증·요청·응답 필드는 [FORIF Scalar](https://dev.forif.org/scalar)를
최신 기준으로 사용합니다. API 연동은 Scalar와 실제 타입 정의를 함께 확인합니다.
백엔드 연동 필드는 `snake_case` 형식을 사용합니다.

## 문서 기준

- [README.md](README.md): 저장소 소개와 빠른 시작
- 이 문서: 공통 개발·검증·PR 흐름
- [GIT_WORKFLOW.md](GIT_WORKFLOW.md): 브랜치, PR 승격, 배포와 hotfix 기준
- [ARCHITECTURE.md](ARCHITECTURE.md): 디렉터리 책임, 의존성 방향, 파일 명명 기준
- [CODEX.md](CODEX.md): Codex 작업 지침
- [CLAUDE.md](CLAUDE.md): Claude Code 작업 지침
- 앱 README: 앱별 실행과 환경 설정

문서의 명령·버전·경로는 설정 파일을 기준으로 작성합니다. 파일 경로는 저장소 기준
상대 경로를 사용합니다.
