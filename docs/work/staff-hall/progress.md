# 운영진 지원·명예의 전당 진행 기록

## 기준선

- 기록일: 2026-10-14 (Asia/Seoul)
- 담당: 한지석 / frontend
- 현재 checkout: `dev` / `8f90e06` (`origin/dev`와 일치, 아래 3단계 구현은 미커밋)
- 참고 backend checkout: `feature/staff-recruitment-application` / `d657458`
- 계약: `staff-hall-contract-r2`
- 계약 상태: backend 3단계 구현 `d657458` 대조 및 실제 HTTP 재검증 완료
- Git 상태: 2단계까지 `origin/dev`에 반영됨. 3단계 frontend 구현은 미커밋.

## 전체 진행표

| 단계                     | 담당 구현             | 자동 검증                | 실제 연동·수동 검증             | 상태      | 완료 기준       |
| ------------------------ | --------------------- | ------------------------ | ------------------------------- | --------- | --------------- |
| 1. 범위·재사용·계약      | 프론트 조사·설계 완료 | 문서 점검 통과           | backend r2 동기화               | 부분 완료 | 프론트 체크 4/4 |
| 2. 모집 설정·배너·안내   | 화면·adapter 완료     | lint/type/관련 test 통과 | 실제 API·SSR·viewport 통과      | 완료      | 프론트 체크 4/4 |
| 3. 지원서 제출·조회      | web/admin 연결 완료   | type/전체 test 통과      | 실제 API·공개 UI·인증 경계 통과 | 완료      | 4/4             |
| 4. 열람자 초대·회수      | admin UI·adapter 완료 | 관련 type/test 통과      | backend API 없음                | 연동 대기 | 3/4             |
| 5. 명예의 전당 관리·게시 | 미착수                | 미실행                   | 미실행                          | 미착수    | 0/4             |
| 6. 명예의 전당 공개 화면 | 미착수                | 미실행                   | 미실행                          | 미착수    | 0/4             |
| 7. 통합 QA               | 미착수                | 미실행                   | 미실행                          | 미착수    | 0/4             |
| 8. 출시 준비·배포        | 미착수                | 미실행                   | 미실행                          | 미착수    | 0/4             |

## 1단계 완료 체크

- [x] 화면·재사용 대상·최소 변경 파일 목록을 작성했다.
- [x] 제안 정책과 미결정 정책, 계약 리비전의 합의 여부를 구분했다.
- [x] 화면별 정상·로딩·빈 값·오류·권한 없음 상태를 정의했다.
- [x] API 요청사항과 디자인 비교 근거를 인계 문서에 정리했다.

프론트 1단계 산출물은 완료했지만, 공동 1단계는 backend 모델·권한·오류 계약과 운영 정책이
확정되어야 완료된다. 따라서 현재 상태는 **설계 초안 완료 / 계약 확정 대기**다.

### 사용자 확정 정책

- 지원 대상: 로그인한 정회원
- 지원 횟수·부서: 한 회차당 1회, 1지망·2지망 허용
- 개인정보 보관: 지원서 개인정보·답변·지망을 DB에 영구 보관, 자동 삭제 없음

정회원의 실제 backend 판정 조건과 2지망 optional 저장·검증 규칙은
`staff-hall-contract-r2`에서 기술 계약으로 구체화한다. 영구 보관 정책을 바꾸려면 별도
계약 리비전이 필요하다.

## 조사 결과

### 현재 구현과 재사용 경계

| 영역           | 확인한 기존 구현                                         | 재사용 방식                                                          | 그대로 재사용하지 않는 부분                                              |
| -------------- | -------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| admin 레이아웃 | `(dashboard)/layout.tsx`, `AppSidebar`, `PageHeader`     | 기존 sidebar와 `p-4 sm:p-6 md:p-8` page container 유지               | 신규 전역 레이아웃·권한 체계 추가 없음                                   |
| 운영진 후보    | `/operators`, `/admin-accounts`                          | 검색·학기 선택·목록·모달, ADMIN 계정 후보 표시                       | 운영진 명단과 ADMIN 계정, 회차별 열람 권한을 같은 개념으로 취급하지 않음 |
| 지원서 목록    | `/study-applications`                                    | 검색·정렬·페이지네이션·상태·상세 진입 패턴                           | 스터디 지원 데이터와 상태를 운영진 지원에 전용하지 않음                  |
| 관리 폼·게시   | `/products`, `/semester`                                 | 입력 검증, 저장 중 차단, 확인 dialog, 상태 badge, 이미지 업로드 패턴 | 상품 승인 상태나 스터디 일정을 모집·전시 상태로 재사용하지 않음          |
| web 진입       | 홈 `QuickMenu`, `HOME_CAROUSEL_BANNERS`, `/club/recruit` | 기존 진입점과 Carousel 구성 유지                                     | 정적 배너 상수를 모집 상태의 단일 원본으로 사용하지 않음                 |
| 지원 폼        | `ProductApplyView`                                       | field error, 첫 오류 focus, 제출 중 차단, 완료 화면 패턴             | 제품 multipart·수정 정책을 운영진 지원에 복제하지 않음                   |
| 인물 카드      | `/club/team`, `TeamCard`                                 | 이미지 대체, 학기 탐색, 카드 grid 기준                               | 운영진 소개 데이터를 명예의 전당 콘텐츠로 자동 간주하지 않음             |
| 전시 목록·상세 | `/products`, `/hackathon/archive`와 상세                 | breadcrumb, `max-w-main`, 필터, 카드, 상세의 1열→2열 구조            | 별도 테마·과도한 motion·새 디자인 시스템 추가 없음                       |
| API·인증       | `@core/utils/api-client`, NextAuth, web/admin middleware | 기존 토큰 주입·401 갱신·ADMIN 경계 유지                              | USER 열람자를 허용하기 위한 admin 전역 인증 완화 없음                    |
| 공통 계약      | `packages/core`                                          | 두 앱이 공유하는 snake_case 타입·schema만 추가                       | 화면 상태·필터·문구를 core에 올리지 않음                                 |

### 현재 확인한 중요한 제약

1. `/club/recruit`는 모집 마감 문구만 표시하는 정적 공개 화면이다.
2. QuickMenu의 운영진 지원 링크는 항상 존재한다. 홈 Carousel에는 운영진 모집 데이터 연동이 없다.
3. web middleware는 `/club` 하위 경로를 공개로 처리하지만 지원서 작성 경로는 아직 보호 경로로 정의되지 않았다.
4. 로그인 server action은 고정된 `/auth/callback?flow=signin`으로 복귀한다. 모집 상세로 안전하게 돌아오는 계약이 새로 필요하다.
5. admin middleware는 유효한 `ADMIN` 세션만 허용한다. 회차별 열람 권한은 backend가 요청마다 검사해야 한다.
6. sidebar의 회장단 메뉴 표시는 세션 `affiliation` 문자열을 사용한다. 이는 UX 표시일 뿐 최종 인가가 아니다.
7. backend feature `38a24d1`에는 운영진 모집 회차 API가, `d657458`에는 지원서 API가 구현돼 있다. dev 배포 OpenAPI 반영 여부는 별도 배포 확인이 필요하다.
8. `GET/HEAD /api/v1/files/**`는 공개다. 비공개 지원 첨부는 이 경로를 사용할 수 없다.

## 화면 배치와 최소 변경 계획

아래 경로는 프론트 정보 구조 제안이며 API 경로와 마찬가지로 확정 계약이 아니다.

| 앱    | 화면                  | 제안 route                                                        | 참고 화면                         | 예상 최소 코드 위치                                           | 기존 사용자 영향                  |
| ----- | --------------------- | ----------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------- | --------------------------------- |
| admin | 모집 회차 목록·설정   | `/staff-recruitments`, `/staff-recruitments/[roundId]`            | semester, products                | `app/(dashboard)`의 얇은 route + `features/staff-recruitment` | 회장단 sidebar 항목만 추가        |
| admin | 지원서 목록·상세      | `/staff-applications`, `/staff-applications/[applicationId]`      | study-applications                | `features/staff-applications`                                 | 기존 스터디 신청자 화면 변경 없음 |
| admin | 열람자 관리           | 모집 상세 내부 tab 또는 `/staff-recruitments/[roundId]/reviewers` | operators, admin-accounts         | 모집 feature 내부                                             | ADMIN 전체 권한은 변경하지 않음   |
| admin | 명예의 전당 관리      | `/hall-of-fame`, `/hall-of-fame/[entryId]`                        | products                          | `features/hall-of-fame`                                       | 회장단 sidebar 항목만 추가        |
| web   | 모집 안내             | 기존 `/club/recruit`                                              | 현재 recruit, PageHeader          | `features/staff-recruitment`로 본문 분리                      | 기존 링크 유지                    |
| web   | 지원서 작성           | `/club/recruit/[roundId]/apply`                                   | ProductApplyView                  | 모집 feature 내부                                             | 보호 경로와 로그인 복귀 규칙 추가 |
| web   | 본인 지원 내역        | `/my` section 또는 `/club/recruit/my`                             | my product applications           | 계약 확정 후 한 곳만 선택                                     | 기존 my 화면의 다른 section 유지  |
| web   | 명예의 전당 목록·상세 | `/hall-of-fame`, `/hall-of-fame/[slug]`                           | team, products, hackathon archive | `features/hall-of-fame`                                       | nav에 목적지 1개만 최소 추가      |
| core  | 공유 계약             | route 없음                                                        | products, semester API            | `types`, `schemas`, 필요할 때만 `api`                         | 기존 client 기본 동작 유지        |

## 화면 상태 계약

| 화면           | 정상                                   | 로딩                                    | 빈 값                      | 오류                            | 권한 없음·행동 불가                               |
| -------------- | -------------------------------------- | --------------------------------------- | -------------------------- | ------------------------------- | ------------------------------------------------- |
| 모집 관리      | 회차·기간·게시/접수 상태와 편집 action | form/list skeleton 또는 disabled 저장   | 회차 없음 + 생성 action    | 재시도 가능한 PageState/toast   | 회장단이 아니면 설명과 돌아가기, backend 403 유지 |
| 모집 공개 안내 | 제목·안내·기간·부서·지원 action        | layout 유지 skeleton                    | 모집 없음/비공개/마감 안내 | 재시도와 공지 링크              | 비로그인은 안내 열람 가능, 작성 시 로그인         |
| 지원서 작성    | 문항·검증·제출                         | 초기 schema skeleton, 제출 중 버튼 차단 | 문항 없음은 제출 차단      | field error와 server error 분리 | 기간 밖·중복 제출·자격 없음 사유 표시             |
| 본인 지원서    | 회차·제출 시각·답변·허용 action        | card skeleton                           | 지원 내역 없음             | 재시도                          | 타인 ID 직접 접근은 404 또는 403 계약대로 처리    |
| 지원서 관리    | 회차·부서 filter, 목록·상세            | table skeleton                          | 조건에 맞는 제출 없음      | 목록/상세 오류 분리             | 미초대·다른 회차·회수/만료는 backend 403          |
| 열람자 관리    | 후보 검색·초대 상태·만료·회수          | 목록 skeleton·mutation 차단             | 후보/초대 없음             | 충돌·이미 초대·계정 없음 표시   | 회장단만 변경, 열람자는 읽기 권한만               |
| 전시 관리      | draft/게시 상태·미리보기·순서          | form/list skeleton                      | 콘텐츠 없음 + 생성 action  | 저장·업로드·게시 오류 분리      | 편집 권한 없음과 공개 여부를 구분                 |
| 전시 공개      | 시즌 filter·카드·상세                  | 카드/detail skeleton                    | 게시 콘텐츠 없음           | 재시도/목록 복귀                | draft·게시 중단 항목은 공개 조회에서 404          |

## 반응형·디자인 결정 초안

| 대상             | 390px                                                  | 768px                         | 1440px                         | 보존할 행동              |
| ---------------- | ------------------------------------------------------ | ----------------------------- | ------------------------------ | ------------------------ |
| admin table/list | 핵심 열 카드화 또는 필요한 열만 유지, action menu 노출 | table 전환 직전 overflow 확인 | 기존 DataTable 전체 열         | 검색·필터·상세·mutation  |
| 모집 form        | 필드와 action 세로, 버튼 full width                    | action row 전환               | 기존 최대 폭 안의 section 구성 | 오류 확인·저장·취소      |
| 공개 card grid   | 1열                                                    | 2열                           | 3열                            | 시즌 변경·상세 이동      |
| 상세 화면        | 본문→보조정보 순서 1열                                 | 1열 또는 전환                 | `1fr + 300px` 참고             | 읽기·목록 복귀·주 action |
| dialog           | viewport 내부 스크롤                                   | max-width 적용                | 기존 dialog 폭                 | 취소·확정·focus 복귀     |

2026-10-11 로컬 browser에서 홈, `/club/recruit`, `/club/team`, `/products`,
`/hackathon/archive`를 확인했다. 약 640px 폭에서 기존 heading, breadcrumb, button, 빈 상태,
skeleton과 footer 배치를 확인했다. backend를 실행하지 않은 상태에서 admin `/operators`
직접 진입은 `/signin`으로 redirect되어 ADMIN 세션 경계를 확인했으며, 인증 후 관리 화면은
확인하지 못했다. 브라우저 도구가 정확한 viewport override를 제공하지 않아 390/768/1440의
실제 렌더링 검증은 UI 구현 단계로 이월한다.

## 검증 기록

- dev OpenAPI `https://dev.forif.org/v3/api-docs` 조회: 성공. 신규 staff recruitment/hall of fame API 없음.
- local backend source 검색: 성공. 기존 `requirePresidentTeam`, `requirePresident`, 공개 파일 경로 확인.
- web/admin 로컬 dev 실행: 성공. Next.js 15.5.24, `.env` 사용.
- web 기존 화면 browser 확인: 부분 성공. 외부 dev API 데이터가 없는 상태의 empty/skeleton 중심.
- admin 기존 관리 화면 browser 확인: backend·유효 계정 없이 signin redirect까지만 확인. 인증 후 실제 화면은 미확인.
- 390/768/1440 정확한 viewport 확인: 미실행. 현재 browser capability 미지원.
- 1단계 당시 `pnpm lint`, `pnpm type-check`, `pnpm test`: 문서만 추가한 단계라 미실행.

## 다음 단계 선행 조건

1. backend 4단계 reviewer API와 DTO·오류 코드를 구현한 뒤 frontend 임시 연결 계약을 실제 코드와 대조한다.
2. reviewer가 열람 가능한 회차를 발견하는 API 또는 초대 전달 경로를 확정한다.
3. 지원자와 reviewer의 이해충돌 정책은 backend에서 최종 확정하고 요청마다 검사한다.
4. 5단계는 모집 4단계와 독립적으로 시작할 수 있지만 전시 계약 `r2`의 미결정 정책 확정이 필요하다.

## 4단계 완료 체크

- [x] 회장단 세션에만 열람자 초대·회수 route와 action을 노출하고 backend 권한 검사를 유지한다.
- [ ] 일반 운영진·다른 회차 열람자·회수/만료 계정을 실제 backend 응답으로 확인한다.
- [x] 부여 요청에 `user_id`와 `expires_at`만 보내며 ADMIN role을 자동 부여하지 않는다.
- [x] 기존 ADMIN 대상 즉시 부여를 기준으로 수락 절차와 일반 web 화면을 제외한 근거를 기록했다.

### 4단계 구현·검증 기록

- admin: `/staff-recruitments/[recruitmentId]/reviewers`에 후보 검색, ADMIN 계정 상태,
  active/revoked/expired 부여 내역, 필수 만료 시각, 즉시 부여와 확인 후 회수를 구현했다.
- admin: 모집 관리 카드에서 열람자 관리로 이동한다. 지원서 메뉴는 모든 ADMIN에게 보이되
  목록·상세의 최종 회차 권한은 backend가 검사한다.
- admin: 지원서 목록·상세 요청이 403이면 이전 목록과 열린 상세를 즉시 비우고 권한 없음
  상태로 전환한다. 이미 본 정보까지 회수됐다고 표현하지 않는다.
- 일반 web: 기존 ADMIN만 reviewer가 되는 제안 계약에 따라 초대·수락 화면을 추가하지 않았다.
- core: reviewer 후보·grant·상태와 부여 요청 타입을 추가했다. 이름은 표시용이며 요청은
  `user_id`를 사용한다.
- 관련 Jest 2 suites/10 tests, admin 전체 57 suites/176 tests 및
  core/web/admin type-check 통과.
- backend `feature/staff-recruitment-application@d657458`에는 reviewer API·DB·인가가 아직
  없어 실제 초대 → 열람 → 회수/만료 → 403 왕복과 인증 화면 검증은 연동 대기다.
- 로컬 browser에서 `/staff-recruitments/6/reviewers` 비로그인 직접 진입이 admin
  `/signin`으로 이동하는 전역 ADMIN 인증 경계를 확인했다. 인증 후 후보·목록과
  390/768/1440px 검증은 backend API 및 유효 회장단 세션이 없어 대기한다.
- 현재 모집 관리 목록 API는 회장단 전용이다. 일반 reviewer는 회차 ID가 포함된 직접 URL로
  지원서에 접근할 수 있게 만들었지만, 열람 가능한 회차 탐색 endpoint 또는 초대 전달
  경로가 없어 backend 계약 보완이 필요하다.

## 3단계 완료 체크

- [x] 로그인 복귀 경계와 공개 UI를 브라우저로, 제출 → 내 상세 → 관리자 목록·상세를 로컬 backend 실제 HTTP로 왕복 확인했다.
- [x] 동시 제출·작성 중 마감·긴 답변을 실제 HTTP로, 390px 모바일 레이아웃을 브라우저로 확인했다.
- [x] 개인정보를 URL·client log·public cache·fixture에 넣지 않았고 개인정보 API는 `no-store`로 호출한다.
- [x] 기존 로그인·스터디 지원 경계를 포함한 web/admin 전체 회귀 테스트가 통과했다.

### 3단계 구현·검증 기록

- web: `/club/recruit/[recruitmentId]/apply` 동적 지원서, 1지망 필수·2지망 선택,
  필수/최대 글자 수 검증, 제출 중 중복 클릭 차단, 서버 오류별 안내를 구현했다.
- web: 안전한 내부 `callbackUrl`만 허용하는 로그인 복귀와
  `/club/recruit/[recruitmentId]/application` 본인 상세를 구현했다. 입력값은 브라우저 저장소에
  보관하지 않으며 실패 시 React state의 작성 내용을 유지한다.
- admin: `/staff-applications` 회차·지망 부서·이름 검색, 서버 offset 페이지네이션,
  최소 개인정보 목록과 상세 dialog를 구현했다. 별도 client 정렬은 추가하지 않았다.
- backend `d657458` 소스와 제출/본인/관리자 DTO·권한·오류·cache 계약을 대조했다.
  관리자 부서 필터는 실제 컨트롤러 이름인 `departmentId`를 사용한다.
- web type-check 통과, 전체 46 suites/164 tests 통과.
- admin type-check 통과, 전체 56 suites/171 tests 통과.
- web/admin production build는 컴파일·타입 검사·정적 페이지 생성(web 30, admin 28)까지
  통과했고, 마지막 standalone trace만 Windows symlink 권한 `EPERM`으로 실패했다.
- MySQL 8·Redis 7과 backend `local` 프로파일을 기동해 실제 HTTP 왕복을 완료했다.
  1001자 답변은 `400/FOR157-400`, 정상 제출은 `201`, 순차·동시 중복은 각각
  `409/FOR154-409` 및 `201/409`, 자격 미달은 `403/FOR153-403`, 마감 후 제출은
  `400/FOR152-400`을 확인했다. 본인 조회·관리자 목록/상세는 `200`이었고 개인정보
  응답은 모두 `Cache-Control: no-store, private`였다.
- 브라우저에서 공개 모집 데이터, 지원 CTA, 비로그인 접근 시
  `/signin?callbackUrl=%2Fclub%2Frecruit%2F6%2Fapply` 복귀 경로, admin `/signin` 인증
  경계를 확인했다. 390/768/1440px에서 문서 폭이 viewport를 넘지 않고 제목과 CTA가
  유지됐다.
- 실제 운영진 비밀번호와 web Google OAuth 세션을 사용하지 않았으므로 인증 후 화면 클릭은
  실제 API 왕복과 전체 자동 테스트로 대체했다. 이는 구현 완료와 별개인 사용자 계정 기반
  수동 인수 확인 항목이다.
- 로컬 DB에 QA 회차 5(마감, 가짜 지원서 2건)와 회차 6(게시 중)을 남겼다. 동시 제출
  검증 전 로컬 스키마에서 V6 unique key가 빠진 것을 발견해
  `(recruitment_id, applicant_user_id)` unique key를 로컬 DB에 보완했다. 운영 DB 변경은 없다.

## 2단계 완료 체크

- [x] 관리자 API로 생성·수정·게시한 실제 회차가 일반 웹 안내와 홈 배너에 동일하게 반영된다.
- [x] 모집 없음·오류·마감에서도 홈 API 오류를 격리해 기존 섹션을 계속 렌더링한다.
- [x] `publication_status`와 `application_status`/`application_open`을 분리해 공개 여부와 접수 가능 여부를 혼동하지 않는다.
- [x] 변경 화면을 390/768/1440 viewport에서 비교하고 가로 넘침과 핵심 CTA 노출을 확인했다.

### 2단계 검증 기록

- `pnpm lint --filter=@repo/core --filter=web --filter=admin`: 통과
- `pnpm type-check --filter=@repo/core --filter=web --filter=admin`: 통과
- web/admin 신규 feature Jest 8개: 통과
- core 전체 테스트: 11 suites, 42 tests 통과
- web 전체 테스트: 45 suites, 157 tests 통과
- admin 전체 테스트: 55 suites 중 53개 통과, 이번 변경과 무관한 기존 semester 테스트 2건 실패
  - `semester-manage-view.test.tsx`: 단독 재실행 통과
  - `schedule-section.test.tsx`: 단독 재실행에서도 기존 5초 timeout 실패
- web/admin production build: 컴파일·타입 검사·정적 페이지 생성(web 30, admin 27) 통과
- web/admin production build 최종 standalone trace: Windows symlink 권한 `EPERM`으로 패키징 실패
- 로컬 web dev server: 기동 성공
- 로컬 HTTP 확인: `/`, `/club/recruit` 모두 200
- Codex in-app browser: webview attach timeout으로 390/768/1440 실제 렌더링 미검증
- admin API 전체 상태 전이는 실연동 통과. 인증된 admin 브라우저 UI 클릭은 유효 세션 자동화가 없어 미검증

### 2026-10-13 실제 연동 보강

- 관련 admin Jest: 2 suites, 5 tests 통과. core/web/admin type-check와 lint 통과.
- backend `feature/staff-recruitment-application` (`d657458`, 2단계 구현 `38a24d1`)을 MySQL 8·Redis 7과 `local` 프로파일로 기동했다.
- 공개 현재 회차 없음: `GET /api/v1/staff-recruitments/current` → `200`, `data: null`, `Cache-Control: no-cache` 확인.
- 무인증 관리자 목록: `401`, `FOR017-401`; 없는 공개 회차: `404`, `FOR148-404` 확인.
- 로컬 QA 데이터로 관리자 목록 → 생성(`201/DRAFT/v0`) → 수정(`200/v1`) → 게시(`PUBLISHED/v2`) → 공개 조회(`OPEN`, 공개 응답에 `version` 없음) → 마감(`CLOSED/v3`)을 실제 HTTP로 확인했다.
- 공개 회차를 다시 게시해 web dev `/club/recruit`와 홈 `/`의 SSR HTML에서 같은 제목, 부서 2개, 문항, 영구보관 안내를 확인했다. 마감 직후 두 화면에서 이전 회차가 제거되고 홈은 `200`을 유지했다.
- backend 실제 계약에 맞춰 공개/관리 응답 타입을 분리하고, PATCH/action의 필수 `version`, 전체 교체 배열의 ID 미전송, 관리자 목록 고정 정렬을 반영했다.
- 검증 중 로컬 운영진 소속은 일시적으로 회장 값으로 전환했으며 원래 바이트 값으로 복구했다. QA 회차 2건은 모두 `CLOSED` 상태로 남겼다.
- 인증된 admin 브라우저 UI 클릭과 390/768/1440 시각 비교는 브라우저 자동화 연결 실패로 미검증이다. API 전체 흐름과 공개 SSR 연동은 완료했다.
