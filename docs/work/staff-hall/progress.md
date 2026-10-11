# 운영진 지원·명예의 전당 진행 기록

## 기준선

- 기록일: 2026-10-11 (Asia/Seoul)
- 담당: 한지석 / frontend
- 현재 checkout: `dev` / origin 기준 `da12bca`
- 참고 backend checkout: `dev` / `6e1f75b` (문서 commit, 미게시)
- 계약: `staff-hall-contract-r1`
- 계약 상태: 2단계 frontend 검토 완료, backend API 구현·실연동 대기
- Git 상태: frontend 1·2단계 변경은 origin/dev 기반 local dev에 commit. push 없음.

## 전체 진행표

| 단계                     | 담당 구현             | 자동 검증                | 실제 연동·수동 검증            | 상태      | 완료 기준       |
| ------------------------ | --------------------- | ------------------------ | ------------------------------ | --------- | --------------- |
| 1. 범위·재사용·계약      | 프론트 조사·설계 완료 | 문서 점검 통과           | backend r1 검토                | 연동 대기 | 프론트 체크 4/4 |
| 2. 모집 설정·배너·안내   | 화면·adapter 완료     | lint/type/신규 test 통과 | API 미제공·browser attach 실패 | 연동 대기 | 프론트 체크 2/4 |
| 3. 지원서 제출·조회      | 미착수                | 미실행                   | 미실행                         | 미착수    | 0/4             |
| 4. 열람자 초대·회수      | 미착수                | 미실행                   | 미실행                         | 미착수    | 0/4             |
| 5. 명예의 전당 관리·게시 | 미착수                | 미실행                   | 미실행                         | 미착수    | 0/4             |
| 6. 명예의 전당 공개 화면 | 미착수                | 미실행                   | 미실행                         | 미착수    | 0/4             |
| 7. 통합 QA               | 미착수                | 미실행                   | 미실행                         | 미착수    | 0/4             |
| 8. 출시 준비·배포        | 미착수                | 미실행                   | 미실행                         | 미착수    | 0/4             |

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
- 개인정보 보관: 임시 정책으로 모집 종료 후 6개월 보관 후 삭제

정회원의 실제 backend 판정 조건, 2지망 필수 여부, 조기 마감·취소 시 6개월 기준 시각과
삭제 범위는 `staff-hall-contract-r1`에서 기술 계약으로 구체화한다.

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
7. 현재 local backend와 2026-10-11 dev OpenAPI에는 운영진 모집·지원서·회차별 열람자·명예의 전당 API가 없다.
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

1. `contract.md`에 남은 미결정 정책을 사용자/회장단이 확정한다.
2. 황재환이 endpoint·DB 모델·인가·오류 코드를 검토하고 계약을 `r1`로 확정한다.
3. 실제 개발은 최신 `dev` 기준 작업 브랜치에서 시작한다.
4. 2단계 모집 구현 전 공개 모집 조회와 관리 API의 최소 계약이 필요하다.
5. 5단계는 모집 2~4단계와 독립적으로 시작할 수 있지만 전시 계약 `r1`이 필요하다.

## 2단계 완료 체크

- [ ] 실제 어드민 설정이 일반 웹 안내와 배너에 반영된다. backend API 미구현으로 대기한다.
- [x] 모집 없음·오류·마감에서도 홈 API 오류를 격리해 기존 섹션을 계속 렌더링한다.
- [x] `publication_status`와 `application_status`/`application_open`을 분리해 공개 여부와 접수 가능 여부를 혼동하지 않는다.
- [ ] 변경 화면을 기존 유사 화면과 390/768/1440 viewport에서 비교한다. browser attach timeout으로 대기한다.

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
- admin 화면: 유효 ADMIN 세션과 backend API가 없어 실제 설정 흐름 미검증
