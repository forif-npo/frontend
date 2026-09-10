# 저장소 구조와 명명 규칙

이 문서는 FORIF Frontend 모노레포에서 파일을 둘 위치와 이름을 판단하는 기준이다.
목표는 기능을 찾기 쉽게 만들고, 앱 전용 구현이 공통 패키지로 새는 일과 공통 계약이
앱마다 복제되는 일을 막는 것이다.

이 문서는 새 코드와 변경하는 주변 코드에 적용한다. 기존 파일을 규칙에 맞춘다는 이유만으로
대규모 이동을 하지 않는다. 이동은 실제 중복, 독립된 변경 주기, 또는 책임 경계가 확인될 때
작은 단위로 진행한다.

## 기능 탐색 순서

처음 보는 기능은 이름으로 저장소 전체를 훑기보다 아래 순서로 읽는다.

1. 사용자 URL에 맞는 `apps/*/src/app`의 route 파일에서 진입점과 권한·데이터 경계를 찾는다.
2. route가 조합하는 `features/<feature>`에서 화면, 상태, API 흐름을 읽는다.
3. 요청·응답 필드와 검증은 `packages/core/src/types`, `packages/core/src/schemas`, Scalar 계약을 함께 확인한다.
4. 공통 UI 동작과 디자인 토큰이 필요할 때만 `packages/ui`를 읽는다.
5. 같은 이름의 코드가 web과 admin에 모두 있으면 공통 계약인지, 우연한 이름 중복인지
   import와 변경 주기로 판단한다.

한 파일의 경로만으로 책임을 단정하지 않는다. import하는 모듈, 호출하는 route, 테스트가
실제 소유 경계를 보여 준다.

## 판단 우선순위

파일 위치를 정할 때 아래 순서로 판단한다.

1. 사용자 동작, API, 권한, 데이터 형식처럼 제품 계약을 먼저 보존한다.
2. 파일이 어느 사용자·운영 기능을 소유하는지 정한다.
3. 한 앱에서만 쓰는지, web과 admin이 모두 쓰는지 확인한다.
4. 화면 조합·React 상태·API 호출을 갖는지, 순수 도메인 계약인지 구분한다.
5. 현재 소비자가 둘 이상이고 독립적으로 변경될 이유가 있을 때만 `core` 또는 `ui` 같은
   공통 위치로 승격한다. 단일 소비자라도 독립 공개 API와 변경 주기가 분명한 라이브러리는
   `big-calendar`처럼 별도 패키지로 둘 수 있다.

파일을 옮기기 전에는 `rg`로 import와 테스트를 확인한다. 경로 자체가 외부 공개 계약인지는
`package.json`의 `exports`, TypeScript path alias, 동적 import를 함께 확인한다.

## 최상위 구조

| 위치                    | 책임                                                | 두지 않는 것                                       |
| ----------------------- | --------------------------------------------------- | -------------------------------------------------- |
| `apps/web`              | 부원·멘토 서비스의 라우트와 기능                    | admin 전용 화면, 다른 앱에서 검증되지 않은 공통 UI |
| `apps/admin`            | 운영진 서비스의 라우트와 기능                       | web 전용 화면, 다른 앱에서 검증되지 않은 공통 UI   |
| `packages/core`         | 앱에 독립적인 도메인 계약, 검증, 공통 유틸리티      | 화면 상태, React UI 조합, 앱 전용 API 흐름         |
| `packages/ui`           | web·admin에서 재사용하는 UI primitive와 디자인 토큰 | 도메인 규칙, API 호출, 특정 화면의 상태            |
| `packages/big-calendar` | 독립 캘린더 UI·상태·스키마 라이브러리               | 앱의 API 호출, 권한 판단, 라우트 데이터 흐름       |
| `packages/*-config`     | 도구 설정                                           | 제품 기능 코드                                     |
| `packages/assets`       | 공용 정적 자산                                      | 화면별 조합이나 비즈니스 로직                      |

`apps/web`과 `apps/admin`은 서로의 소스 코드를 직접 import하지 않는다. 공유가 필요하면
성격에 따라 `packages/core` 또는 `packages/ui`로 추출한다.

## 앱 내부 디렉터리

### `src/app`

Next.js 라우팅 경계다. `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`,
`not-found.tsx`, `route.ts`와 해당 라우트의 얇은 조합 코드를 둔다.

- 라우트 파일은 데이터 진입, 메타데이터, 권한 경계, feature 조합을 담당한다.
- 화면의 도메인 로직·복잡한 상호작용·재사용 가능한 UI는 `features`로 보낸다.
- 해당 route에서만 의미가 있고 분리해도 재사용·가독성 이득이 없는 작은 서버 조합은
  route 옆에 둘 수 있다.
- App Router의 예약 파일명과 URL 세그먼트는 Next.js 규칙을 따른다. URL을 바꾸는 이동은
  구조 정리가 아니라 사용자 계약 변경이다.

### `src/features/<feature>`

사용자 또는 운영 기능의 소유 경계다. 예: `study`, `hackathon`, `products`, `auth`.
화면 컴포넌트, 해당 기능의 훅, API 어댑터, 상태, 순수 보조 함수, feature 전용 타입을
가까이 둔다.

- 한 파일이 특정 기능 용어를 알아야 한다면 우선 해당 feature에 둔다.
- feature 내부는 필요해질 때 `components`, `hooks`, `api`, `types`, `constants`, `utils`처럼
  역할별 하위 디렉터리를 만든다. 파일이 한두 개일 때는 과도한 하위 폴더를 만들지 않는다.
- 한 feature의 구현을 다른 feature가 직접 깊게 import하지 않는다. 실제 공유 책임이 생기면
  앱 공통 위치 또는 패키지로 승격한다.
- `index.ts`는 feature의 의도적인 공개 진입점에만 사용한다. 내부 구현을 모두 재수출하는
  barrel은 순환 의존성과 책임 은폐를 만들 수 있으므로 만들지 않는다.

### React 경계와 상태 소유

React 파일은 위치뿐 아니라 렌더링·상태의 소유자도 함께 판단한다.

- Server Component는 서버 데이터 진입, 권한 확인, metadata와 초기 조합을 담당한다.
  browser API, 이벤트 핸들러, client state가 필요한 부분만 Client Component로 좁힌다.
- Client Component는 자신이 소유한 상호작용과 화면 상태만 관리한다. 상위 route나
  다른 feature의 상태를 알기 위해 client 경계를 넓히지 않는다.
- form, dialog, filter, mutation 같은 상태는 먼저 해당 feature 또는 화면에 둔다. 서로
  독립된 feature가 같은 생명주기와 갱신 규칙으로 실제 공유할 때만 app provider나 전역
  상태로 승격한다.
- custom hook은 재사용 가능성만으로 분리하지 않는다. 비동기 상태, 구독, 폼 흐름, 도메인
  규칙처럼 독립적으로 이해·검증할 수 있는 책임이 있을 때 분리한다.
- server/client 경계, provider 위치, hook의 공개 API를 바꾸는 이동은 렌더링 방식·권한·
  loading/error 동작을 바꿀 수 있으므로 구조 정리로만 간주하지 않는다.

### 앱 공통 디렉터리

| 위치             | 책임                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `src/components` | 해당 앱 전반에서 쓰는 도메인 비종속 UI 조합                                                          |
| `src/hooks`      | 해당 앱 전반에서 쓰는 도메인 비종속 React 훅                                                         |
| `src/constants`  | 해당 앱 전체의 고정 값과 표시 상수                                                                   |
| `src/types`      | 해당 앱에서만 필요한 타입. API 계약 타입은 `@core/types/<domain>`(예: `@core/types/api`)을 우선 사용 |
| `src/utils`      | React와 화면 상태에 의존하지 않는 앱 전반 보조 함수                                                  |
| `src/providers`  | React context와 앱 단위 provider 조합                                                                |
| `src/lib`        | 프레임워크·외부 라이브러리의 앱별 설정 또는 어댑터                                                   |

`cookies`처럼 앱에 이미 있는 기술 경계 디렉터리는 위 표와 같은 원칙으로 유지한다.
feature 이름이 붙는 코드가 하나의 feature에서만 쓰이면 앱 공통 디렉터리에 두지 않는다.
기존에 흩어진 코드는 주변 기능을 수정할 때 점진적으로 정리한다.

## 공통 패키지

### `packages/core`

UI 없는 공통 도메인 계약을 둔다.

- `types`: API 요청·응답과 공통 도메인 타입. 백엔드 필드는 `snake_case`를 보존한다.
- `schemas`: 경계를 검증하는 Zod 스키마와 그로부터 파생한 타입.
- `api`: web·admin이 실제로 함께 쓰는 endpoint adapter. 화면 상태·권한 판단 없이
  공통 API client와 도메인 계약만 사용한다. 앱 전용 요청 흐름은 각 feature의 `api.ts`에 둔다.
- `utils`: 앱과 화면에 독립적인 순수 함수, API client 같은 공통 기술 유틸리티.
- 루트 도메인 모듈: web·admin이 공통으로 사용하는 상태 라벨, 선택지, 도메인 상수.

`core`에 넣으려면 현재 두 앱에서 사용하거나, API/도메인 계약으로 독립적으로 관리해야
한다. 단일 앱의 필터 선택지, 모달 상태, 화면 문구, UI 이벤트 처리는 해당 feature에 둔다.
`core`은 `apps/*`나 `packages/ui`를 import하지 않는다.

루트 도메인 모듈은 한 파일로 유지할 수 있다. 같은 도메인에 독립된 공통 모듈이 여러 개가
되어 탐색 비용이 커질 때만 `core/src/<domain>/`으로 묶는다. 이때 import 경로 변경은
공개 경로 변경일 수 있으므로 소비자 전체를 함께 검증한다.

### `packages/ui`

web과 admin에서 재사용 근거가 있는 UI와 토큰을 둔다.

- 상호작용 여부에 따라 `components/server`, `components/client` 경계를 지킨다.
- DOM 구조, 키보드 동작, `label`, `role`은 공개 UI 계약이다.
- 특정 도메인명, API client, 권한 판단, 화면 상태를 import하지 않는다.
- 앱에서 한 번만 쓰이는 화면 조합은 해당 앱 feature에 둔다.

### `packages/big-calendar`

캘린더의 UI, 상태, 타입, 스키마, helper를 독립적으로 제공하는 라이브러리다. 현재 admin이
소비하며, 사용 앱의 수와 관계없이 캘린더 자체의 변경 주기와 공개 API를 독립적으로 관리할
필요가 있을 때 유지한다.

- `CalendarProvider`, view, dialog, drag-and-drop UI와 캘린더 도메인 타입·스키마를 둔다.
- 이벤트 생성·수정·삭제 API 호출, 서버 데이터 재검증, 권한 판단은 소비 앱의 feature 또는
  route가 관리한다.
- `apps/*`를 import하지 않는다. 일반 UI primitive로 분리할 수 있는 부분은 재사용 근거가
  있을 때 `packages/ui`로 승격한다.

## 파일과 심볼 명명

| 대상                       | 규칙                                           | 예시                                     |
| -------------------------- | ---------------------------------------------- | ---------------------------------------- |
| 디렉터리                   | 소문자 kebab-case, 사용자 기능을 나타내는 명사 | `study-manage`, `my-page`                |
| React 컴포넌트 파일·export | PascalCase                                     | `StudyCard.tsx`, `StudyCard`             |
| hook                       | `use` + PascalCase, 파일명도 export와 일치     | `useStudyData.ts`, `useStudyData`        |
| 역할 파일                  | 소문자 kebab-case 또는 관례적 단일 이름        | `api.ts`, `types.ts`, `draft-storage.ts` |
| 순수 함수                  | 동작을 나타내는 camelCase 동사                 | `formatPhoneNumber`, `getMainStage`      |
| 타입·인터페이스            | 도메인 명사 PascalCase                         | `SubmissionRequest`, `StudyTagCategory`  |
| 상수                       | 의미가 안정된 상수는 UPPER_SNAKE_CASE          | `STUDY_TAG_OPTIONS`                      |
| 테스트                     | 대상 파일과 나란히 `<name>.test.ts(x)`         | `utils.test.ts`, `StudyCard.test.tsx`    |

기존 파일명은 일괄 변경하지 않는다. 새 파일과 변경 범위의 파일에 적용하고, 충돌을 피하기
위해 public export 이름을 우선 보존한다.

## 배치 결정표

| 코드의 성격                                           | 기본 위치                         |
| ----------------------------------------------------- | --------------------------------- |
| URL·라우트·메타데이터·라우트 진입 데이터              | `apps/*/src/app`                  |
| 한 기능의 화면, API 흐름, 상태, 선택지                | `apps/*/src/features/<feature>`   |
| 한 앱의 여러 feature에서 쓰는 비도메인 UI·hook·helper | 앱의 `components`·`hooks`·`utils` |
| web·admin 공통 도메인 타입·스키마·상수·순수 유틸리티  | `packages/core`                   |
| web·admin 공통 UI primitive·토큰                      | `packages/ui`                     |
| 독립적으로 관리하는 캘린더 UI·상태·스키마             | `packages/big-calendar`           |
| 빌드·lint·TypeScript·Tailwind 공통 설정               | 해당 `packages/*-config`          |

`core`와 `ui` 공통화는 “나중에 쓸 수도 있음”이 아니라 현재 중복 또는 둘 이상의 실제
소비자가 근거다. 단일 소비자 라이브러리는 독립 공개 API와 변경 주기가 확인될 때만 별도
패키지로 둔다. 반대로 공통 모듈을 앱으로 내릴 때는 다른 앱·패키지의 import가 없는지 먼저
확인한다.

## 의존성 방향

```text
apps/*/src/app
  ├─ apps/*/src/features, components, providers
  └─ packages/core, packages/ui, packages/assets

apps/*/src/features
  ├─ 같은 feature의 내부 모듈
  ├─ 앱 공통 모듈
  └─ packages/core, packages/ui, packages/assets

apps/admin/src/app, features
  └─ packages/big-calendar

packages/ui ──> packages/core, packages/assets
packages/core ── 도메인 계약·스키마·공통 유틸리티
packages/assets ── 공용 정적 자산
packages/big-calendar ── 캘린더 UI·상태·스키마
```

상위 계층이 하위 계층을 사용한다. `core`와 `ui`는 앱 feature를 알지 못하며, feature는
서로의 내부 구현에 의존하지 않는다. 순환 import가 생기면 공통 추출보다 먼저 책임 경계가
잘못됐는지 검토한다.

## 구조 변경 절차

1. 문제, 현재 소비자, 이동 후 소유자를 적는다.
2. `rg`로 import·테스트·동적 경로를 확인한다.
3. 제품 계약을 바꾸지 않는 최소 경계만 이동하고 import를 갱신한다.
4. 원래 파일과 새 파일의 테스트·타입 검사를 실행한다.
5. API, 권한, 화면 구조를 건드렸다면 [REFACTORING.md](REFACTORING.md)의 해당 검증을
   추가로 따른다.

API 형식·권한·환경 변수·배포·화면 동작을 바꾸는 구조 변경은 사전 영향 검토가 필요하다.
단순 이동도 import 공개 경로, lazy loading, 서버/클라이언트 경계를 바꾸면 계약 변경으로
취급한다.
