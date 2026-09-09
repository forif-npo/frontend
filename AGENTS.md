# FORIF Frontend 에이전트 작업 지침

이 문서는 모든 코딩 에이전트의 작업 진입점입니다.

## 읽는 순서

1. 이 문서에서 공통 작업 원칙을 확인합니다.
2. 코드, 테스트, UI, 문서 구조를 변경할 때는 [ARCHITECTURE.md](ARCHITECTURE.md)와
   [REFACTORING.md](REFACTORING.md)를 확인합니다. 테스트를 만들거나 수정할 때는
   [TESTING.md](TESTING.md), UI를 만들거나 수정하거나 리뷰할 때는
   [DESIGN_REVIEW.md](DESIGN_REVIEW.md)도 확인합니다.
3. Codex는 [CODEX.md](CODEX.md), Claude Code는 [CLAUDE.md](CLAUDE.md)의 도구별
   지침을 확인합니다.
4. 브랜치, PR 승격, 배포 절차는 [GIT_WORKFLOW.md](GIT_WORKFLOW.md)를 확인합니다.
5. 사람이 실행하는 개발·검증·PR 절차는 [CONTRIBUTING.md](CONTRIBUTING.md)를
   확인합니다.

## 공통 원칙

- 의존성 설치와 스크립트 실행에는 `pnpm`을 사용합니다.
- 제품 계약은 사용자 동작, 화면 출력, 접근성 의미, 권한, 데이터 형식, API 계약입니다.
- 권한, 인증, API 계약, 환경 변수, 배포, 데이터 형식, 화면 출력, 사용자 동작에 영향을
  주는 변경은 문제·영향·필요한 결정을 보고한 뒤 진행합니다.
- 문서화, 테스트 보강, 순수 로직 분리, 구조 정리는 제품 계약과 우선순위에 따라
  자율적으로 진행합니다.
- 사용자가 계속 진행을 요청하면 P0, P1, P2, P3 순서로 다음 후보를 선택합니다.
- 테스트는 사용자 동작과 데이터 경계의 계약을 검증합니다.
- UI 작업은 코드 검토에 그치지 않고 `DESIGN_REVIEW.md`에 따라 실제 브라우저 렌더링과
  접근성 구조를 확인하고, 발견한 디자인 결함을 근거와 우선순위와 함께 보고합니다.
- 작업 시작과 완료 시 작업 트리를 확인하고 작업 범위 밖 변경을 보존합니다.
- Git의 stage, commit, push, branch, merge는 사용자가 명시적으로 요청한 경우에만
  수행합니다.
- 작업 보고는 결론, 근거, 사용자 영향, 실행한 검증, 남은 위험 순서로 작성합니다.
- 문장은 현재 규칙과 실행 내용을 직접 설명합니다.

## 저장소 구조

- `apps/web`: 부원·멘토용 웹, 기본 포트 3000
- `apps/admin`: 운영진 관리 웹, 기본 포트 3001
- `packages/core`: 공통 도메인 타입·스키마·유틸리티
- `packages/ui`: 공통 UI 컴포넌트
- `packages/*-config`: 공유 도구 설정

## API 계약

최신 API 계약은 [FORIF Scalar](https://dev.forif.org/scalar)를 기준으로 확인합니다.
API 연동은 Scalar의 경로, 인증 요구 사항, 요청·응답 필드,
`packages/core/src/types/api.d.ts`, 호출 코드를 함께 확인합니다. 백엔드 연동 필드는
`snake_case` 형식을 사용합니다.
