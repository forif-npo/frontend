# 테스트 운영 기준

이 문서는 FORIF Frontend에서 리팩토링과 기능 변경이 사용자·데이터 계약을 계속
보장하도록 테스트 대상을 고르는 기준이다. 목표는 구현 세부를 묶어 두는 것이 아니라,
회귀 비용이 큰 동작을 빠르게 발견하는 것이다.

## 현재 실행 환경

각 앱과 `packages/core`, `packages/big-calendar`는 Jest와 `ts-jest`를 사용한다. 전체
검증은 루트에서 `pnpm test`로 실행한다. 기본 test environment는 `node`이며, React
컴포넌트·hook을 실제 렌더링해야 하는 테스트는 파일 첫 줄에
`/** @jest-environment jsdom */`을 선언한다.

테스트 환경이나 network mocking 도구를 추가·교체·제거하는 일은 단순 정리가 아니다.
대상 범위, 기존에 보장하던 계약, 대체 검증 방법을 먼저 기록하고 합의한 뒤 진행한다.

## 무엇을 테스트하는가

| 대상                       | 우선 검증할 계약                                                | 기본 위치                      |
| -------------------------- | --------------------------------------------------------------- | ------------------------------ |
| 순수 함수·schema·formatter | 입력, 출력, 경계값, 잘못된 값                                   | 대상 파일 옆 `*.test.ts`       |
| API adapter                | endpoint, `snake_case` payload/query, 응답 변환, 오류·fallback  | adapter 옆 `api.test.ts`       |
| custom hook·폼 흐름        | 상태 전이, 비동기 경합, 취소·재시도, 저장·제출 실패             | hook 옆 `*.test.ts(x)`         |
| view·component             | 핵심 사용자 행동, label/role, loading·empty·error·disabled 상태 | component 옆 `*.test.tsx`      |
| route·권한 경계            | 허용·거부·redirect와 데이터 진입                                | route 또는 경계 모듈 옆 테스트 |

테스트는 모든 컴포넌트에 기계적으로 붙이지 않는다. 정적 표현만 하는 컴포넌트보다 권한,
데이터 변환, 제출, 삭제, 단계 이동, 빠른 입력에서 회귀 비용이 큰 경계를 우선한다.

## React 테스트 기준

- 사용자에게 보이는 동작은 `getByRole`, label, visible text 같은 접근 가능한 의미로 찾는다.
  className, 내부 state, private helper 호출을 직접 단언하지 않는다.
- form은 필수 입력, 오류 표시, 비활성 상태, 제출 성공·실패 후의 행동을 검증한다.
- 비동기 hook과 view는 loading, success, failure, unmount 또는 빠른 재입력에서 남는 요청이
  사용자 상태를 잘못 덮어쓰지 않는지 확인한다.
- Server Component와 route의 서버 데이터·권한 경계는 browser 렌더링 테스트로 대체하지
  않는다. 해당 경계의 입력과 반환·redirect 계약을 별도로 검증한다.
- UI 변경은 자동 테스트만으로 완료하지 않는다. `DESIGN_REVIEW.md`에 따라 실제 browser의
  화면, 반응형, keyboard focus, heading/label/role을 확인한다.

## Mock과 fixture 기준

- 외부 API client, router, clock, storage, browser API처럼 테스트 경계를 벗어나는 의존성만
  mock한다. 같은 feature의 구현 세부를 광범위하게 mock해 결과만 통과시키지 않는다.
- fixture는 테스트가 읽는 계약에 필요한 최소 데이터만 만든다. 실제 API 필드는
  `packages/core` 타입·schema와 Scalar 계약을 따른다.
- mock이 제공하던 응답·오류·지연 시나리오를 제거할 때는, 그 시나리오가 불필요해진 근거
  또는 대체 테스트를 함께 남긴다.
- 테스트 전역 설정과 package dependency를 바꾸는 경우에는 영향을 받는 모든 package의
  테스트 실행 결과를 확인한다.

## 변경 유형별 최소 검증

| 변경                  | 최소 검증                                                   |
| --------------------- | ----------------------------------------------------------- |
| 파일 이동·import 정리 | 대상 테스트, type-check, 이전·새 import 경로 확인           |
| 순수 로직 분리        | 분리한 함수의 경계값 테스트와 기존 호출 흐름 테스트         |
| API·타입 공통화       | 공통 adapter 테스트, 각 앱의 feature 호출 계약 테스트       |
| hook·비동기 상태 변경 | 성공·실패·경합 또는 unmount 중 해당 상태 테스트             |
| UI 리팩토링           | 핵심 사용자 행동 테스트와 `DESIGN_REVIEW.md`의 browser 확인 |
| mock·테스트 도구 변경 | 영향 범위의 전체 테스트와 대체 검증 근거                    |

병합 후보의 전체 게이트는 `pnpm lint`, `pnpm type-check`, `pnpm test`다. build, 환경 변수,
Next 설정, 공통 package를 변경했다면 `pnpm build`도 실행한다. 실패 또는 실행하지 못한
검증은 통과로 간주하지 않고 이유와 남은 위험을 기록한다.
