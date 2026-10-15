# 운영진 지원·명예의 전당 프론트 계약 초안

## 계약 메타데이터

| 항목              | 값                                                  |
| ----------------- | --------------------------------------------------- |
| 계약 ID           | `staff-hall-contract-r2`                            |
| 작성일            | 2026-10-13 (Asia/Seoul), backend 실구현 대조        |
| frontend 기준     | local `dev` / `8f90e06` + 미커밋 3단계 구현         |
| backend 참고 기준 | `feature/staff-recruitment-application` / `d657458` |
| backend 2단계     | `38a24d1`                                           |
| 합의 상태         | 3단계 backend 구현 대조·frontend 연결 완료          |

backend `staff-hall-contract-r2`의 공개 모집·관리 모집 구현을 `38a24d1` 소스와 로컬 HTTP
응답으로 대조했다. create/patch는 부서·문항 배열을 embedded 전체 교체 방식으로 받고 기존
ID를 요청에 포함하지 않는다. PATCH와 publish/close/cancel은 최신 `version`이 필수이며,
관리 응답에만 `version`, `ended_at`, `close_reason`이 포함된다. 관리자 목록 정렬은
`recruitment_id DESC` 고정이고 별도 sort 파라미터를 받지 않는다.

## r2 frontend 검토 결과

- 현재 모집 없음은 `200`과 `data: null`로 처리한다.
- 1지망은 필수, 2지망은 선택으로 표시한다.
- 정회원 판정은 frontend에서 계산하지 않고 서버의 `application_open`과 오류를 사용한다.
- 공개 모집은 `no-cache`, 개인정보·관리 응답은 `no-store, private` 계약을 사용한다.
- 2단계 endpoint는 `/api/v1/staff-recruitments/current`와
  `/api/v1/admin/staff-recruitments` 하위 경로를 사용한다.
- dev API 미제공 동안 production fallback이나 가상 모집을 노출하지 않는다.

## 정책 결정표

| 항목                     | 프론트 권장안                                              | 상태   | 결정 주체       |
| ------------------------ | ---------------------------------------------------------- | ------ | --------------- |
| 활성 모집                | 한 번에 공개·접수 대상으로 보이는 회차 1개                 | 제안   | 회장단          |
| 공개/접수                | 안내 공개와 접수 가능 상태 분리, 일정 미설정 시 차단       | 제안   | 회장단+backend  |
| 시간 경계                | Asia/Seoul, `starts_at <= now < ends_at`                   | 제안   | 회장단+backend  |
| 조기 종료                | 조기 마감과 취소를 구분, 서버가 사유 반환                  | 제안   | 회장단          |
| 지원 자격                | 로그인한 정회원                                            | 확정   | 사용자          |
| 부서 지원                | 한 회차당 1회 제출, 1지망·2지망 허용                       | 확정   | 사용자          |
| 문항                     | 1차는 short/long text, required/max_length/display_order   | 제안   | 회장단          |
| 문항 변경                | 접수 시작 후 제출된 답변의 문항 snapshot 보존              | 제안   | 회장단+backend  |
| 임시저장                 | 미채택                                                     | 제안   | 회장단          |
| 제출 후 수정·취소·재지원 | 미채택                                                     | 제안   | 회장단          |
| 첨부                     | 미채택. 필요 시 비공개 저장·다운로드 계약을 먼저 추가      | 제안   | 회장단          |
| 열람 초대                | 기존 ADMIN 계정만, 즉시 부여, 회차별 만료·회수             | 제안   | 회장단          |
| 이해충돌                 | 해당 회차 지원자는 그 회차 열람 대상에서 제외              | 제안   | 회장단          |
| 개인정보                 | 최소 수집, 제출 시점 snapshot과 회원 참조의 역할 구분      | 제안   | 회장단+backend  |
| 보관·삭제                | 지원서 개인정보·답변·지망을 DB에 영구 보관, 자동 삭제 없음 | 확정   | 사용자          |
| 전시                     | 관리자 수동 등록·미리보기·게시·게시 중단                   | 제안   | 회장단          |
| 전시 편집 권한           | 회장단 우선. 일반 ADMIN 허용 여부                          | 미결정 | 회장단          |
| 진입                     | QuickMenu는 안내로 유지, 모집 배너는 공개 회차가 있을 때만 | 제안   | 회장단          |
| 명예의 전당 메뉴         | 동아리 메뉴 아래 목록 목적지 추가                          | 제안   | 회장단+frontend |

## 공통 데이터 계약 요구

### 모집 회차

```ts
type StaffRecruitmentPublicationStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CLOSED"
  | "CANCELED";

type StaffRecruitmentApplicationStatus =
  | "UPCOMING"
  | "OPEN"
  | "CLOSED"
  | "CANCELED";

interface StaffRecruitmentRound {
  recruitment_id: number;
  title: string;
  summary: string | null;
  description: string | null;
  act_year: number;
  act_semester: number;
  semester_label: string;
  starts_at: string | null;
  ends_at: string | null;
  publication_status: StaffRecruitmentPublicationStatus;
  application_status: StaffRecruitmentApplicationStatus;
  application_open: boolean;
  application_unavailable_reason: string | null;
  departments: StaffRecruitmentDepartment[];
  questions: StaffRecruitmentQuestion[];
  updated_at: string;
}

interface AdminStaffRecruitmentRound extends StaffRecruitmentRound {
  ended_at: string | null;
  close_reason: string | null;
  version: number;
}
```

- `application_open`과 차단 사유는 서버가 계산한다. 프론트 시계로 제출 권한을 확정하지 않는다.
- 공개 응답에는 내부 메모·작성자 개인정보·draft 문항을 포함하지 않는다.
- 날짜는 offset이 포함된 ISO 8601 문자열로 전달하고 서버 판정 시간대는 Asia/Seoul로 명시한다.
- 접수 시작 뒤 문항이 바뀔 수 있다면 application 상세는 제출 당시 문항 label/type snapshot을 반환한다.

### 부서·문항

```ts
interface StaffRecruitmentDepartment {
  department_id: number;
  name: string;
  description: string | null;
  display_order: number;
  active: boolean;
}

interface StaffRecruitmentQuestion {
  question_id: number;
  label: string;
  description: string | null;
  type: "SHORT_TEXT" | "LONG_TEXT";
  required: boolean;
  max_length: number;
  display_order: number;
}
```

운영진 모집 부서는 대학 학과 ID와 다른 도메인이다. `tb_department`의 학과를 모집 부서로
사용하지 않는다.

### 지원서

```ts
interface StaffApplicationSummary {
  application_id: number;
  applicant_name: string;
  applicant_department: string | null;
  applied_departments: Array<{
    department_id: number;
    name: string;
    priority: 1 | 2;
  }>;
  status: "SUBMITTED";
  submitted_at: string;
}

interface StaffApplicationDetail extends StaffApplicationSummary {
  recruitment_id: number;
  applicant_user_id: number | null;
  applicant_email: string;
  applicant_phone_num: string | null;
  answers: Array<{
    question_id: number;
    question_label: string;
    question_type: "SHORT_TEXT" | "LONG_TEXT";
    answer: string;
  }>;
}
```

- 목록에는 최소 개인정보만 반환하고 연락처·전체 답변은 상세에서만 반환한다.
- 지원 자격은 로그인한 정회원이다. backend는 기존 회원 데이터에서 "정회원"을 판정하는
  구체적인 상태·조건을 `r2`에 명시하고, frontend에 판정을 위임하지 않는다.
- 동일 `recruitment_id + applicant_user_id`에는 지원서가 하나만 존재해야 한다.
- 지원자는 서로 다른 두 모집 부서를 1지망과 2지망으로 선택할 수 있다. 같은 부서를
  중복 선택할 수 없으며 1지망은 필수, 2지망의 필수 여부는 backend 계약에서 명시한다.
- 현재 권장안에서는 `SUBMITTED`만 사용한다. 취소를 채택할 때만 상태를 추가한다.
- 중복 클릭은 동일 회차·사용자 유일성과 서버 충돌 응답으로 제어한다.
- 실제 개인정보를 URL, client log, public cache, fixture에 남기지 않는다.
- 지원서 개인정보 snapshot과 답변·지망은 모집 종료·조기 마감·취소와 관계없이 DB에 영구
  보관한다. 기간 기반 자동 삭제 scheduler/batch는 구현하지 않으며, 향후 삭제 요구를
  도입하려면 별도 계약 리비전으로 권한·감사·backup 처리 범위를 먼저 확정한다.

### 명예의 전당

```ts
type HallOfFamePublicationStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED";

interface HallOfFameEntry {
  entry_id: number;
  slug: string;
  user_id: number;
  name: string;
  act_year: number;
  act_semester: number;
  semester_label: string;
  title: string;
  introduction: string;
  achievements: Array<{
    achievement_id: number;
    title: string;
    description: string | null;
    link_url: string | null;
    display_order: number;
  }>;
  badges: Array<{ label: string; display_order: number }>;
  image_url: string | null;
  display_order: number;
  publication_status: HallOfFamePublicationStatus;
  published_at: string | null;
  updated_at: string;
}
```

- 공개 목록·상세는 `PUBLISHED`만 반환한다.
- 공개 전시 이미지는 기존 공개 파일 경로를 재사용할 수 있다.
- `slug`, 외부 링크, 이미지 URL은 서버와 프론트 양쪽에서 안전한 형식만 허용한다.
- 기존 운영진·스터디·해커톤·작품 데이터는 선택 근거일 수 있지만 자동 점수나 자동 전시로 해석하지 않는다.

## 화면별 API 계약

2단계 모집 경로는 backend `38a24d1`에서 확정됐다. 3단계 이후 경로는 해당 구현 커밋과
단계별 handoff를 함께 확인한다.

| 화면                | method·후보 경로                                                         | 인증·권한                 | 필요한 결과                               |
| ------------------- | ------------------------------------------------------------------------ | ------------------------- | ----------------------------------------- |
| 공개 모집 안내      | `GET /api/v1/staff-recruitments/current`                                 | public                    | 공개 회차 또는 없음, 서버 계산 접수 상태  |
| 모집 상세           | `GET /api/v1/staff-recruitments/{id}`                                    | public                    | 공개 안내·부서·문항, 접수 가능 여부       |
| 모집 관리 목록      | `GET /api/v1/admin/staff-recruitments`                                   | ADMIN + 회장단            | draft 포함 목록·상태·페이지               |
| 모집 생성           | `POST /api/v1/admin/staff-recruitments`                                  | ADMIN + 회장단            | 생성된 회차와 충돌 정보                   |
| 모집 수정           | `PATCH /api/v1/admin/staff-recruitments/{id}`                            | ADMIN + 회장단            | 갱신된 회차, stale update 충돌 여부       |
| 게시·마감·취소      | `POST /api/v1/admin/staff-recruitments/{id}/publish\|close\|cancel`      | ADMIN + 회장단            | 필수 version, 선택 reason, 최신 관리 회차 |
| 지원 제출           | `POST /api/v1/staff-recruitments/{id}/applications`                      | USER 본인                 | 제출 ID·시각, 중복·기간·자격 오류         |
| 본인 내역           | `GET /api/v1/staff-recruitments/{id}/applications/me`                    | USER 본인                 | 해당 회차의 본인 상세 또는 404            |
| 관리자 지원서 목록  | `GET /api/v1/admin/staff-recruitments/{id}/applications`                 | 회장단 또는 유효 reviewer | 검색·부서·페이지·최소 개인정보            |
| 관리자 지원서 상세  | `GET /api/v1/admin/staff-recruitments/{id}/applications/{applicationId}` | 같은 회차 권한            | 답변·연락처·제출 snapshot                 |
| 열람 후보           | `GET /api/v1/admin/staff-recruitments/{id}/reviewer-candidates`          | 회장단                    | 활동 학기 운영진+ADMIN 계정 상태          |
| 열람자 목록         | `GET /api/v1/admin/staff-recruitments/{id}/reviewers`                    | 회장단                    | active/revoked/expired 상태               |
| 열람 부여           | `POST /api/v1/admin/staff-recruitments/{id}/reviewers`                   | 회장단                    | 중복·지원자 충돌 검증                     |
| 열람 회수           | `DELETE /api/v1/admin/staff-recruitments/{id}/reviewers/{userId}`        | 회장단                    | 다음 요청부터 즉시 차단                   |
| 공개 전시 목록      | `GET /api/v1/hall-of-fame`                                               | public                    | season filter, page/cursor, published만   |
| 공개 전시 상세      | `GET /api/v1/hall-of-fame/{slug}`                                        | public                    | published 상세 또는 404                   |
| 전시 관리 목록·상세 | `GET /api/v1/admin/hall-of-fame[/{id}]`                                  | 합의된 ADMIN              | draft 포함 목록·상세                      |
| 전시 생성·수정      | `POST/PATCH /api/v1/admin/hall-of-fame[/{id}]`                           | 합의된 ADMIN              | 저장 결과·validation 오류                 |
| 전시 이미지         | multipart endpoint 후보                                                  | 합의된 ADMIN              | 공개 가능한 image_url                     |
| 전시 게시·중단      | action endpoint 후보                                                     | 합의된 ADMIN              | 상태·published_at                         |

## 오류 계약 요청

backend의 실제 `FOR{번호}-{HTTP상태}` 코드는 황재환이 배정한다. frontend는 최소한 아래
상황을 서로 구별할 수 있어야 한다.

| HTTP    | 의미                                             | frontend 처리                                      |
| ------- | ------------------------------------------------ | -------------------------------------------------- |
| 400     | 필드·문항·상태 전이 오류                         | field/global 오류를 분리 표시                      |
| 401     | 세션 없음·만료                                   | 안전한 내부 복귀 경로를 포함해 로그인 유도         |
| 403     | 회장단 아님, reviewer 아님, 다른 회차, 회수·만료 | 권한 없음 PageState, 버튼 숨김만으로 대체하지 않음 |
| 404     | 회차/지원서/전시 없음 또는 공개 대상 아님        | 목록 복귀 가능한 not-found                         |
| 409     | 중복 지원·중복 초대·활성 회차 충돌·stale update  | 사용자에게 충돌 원인과 다음 행동 표시              |
| 413/415 | 첨부 채택 시 크기·형식 오류                      | 해당 field 오류                                    |
| 422     | 기간·자격·문항 snapshot 불일치                   | 서버가 반환한 사유 표시, 재조회 유도               |

오류 응답은 기존 `ApiResponse`의 `error_code`, `message`를 유지하고, field 오류가 필요하면
별도 구조를 합의한다. 공개 데이터의 cache 정책, 개인정보 응답의 `no-store`, 이미지 cache
정책도 `r2`에 명시해야 한다.

### 3단계 실제 오류·목록 계약

- 제출 차단: `FOR152-400`(접수 불가), `FOR153-403`(활동 정회원 아님),
  `FOR154-409`(중복), `FOR156-400`(지망 오류), `FOR157-400`(답변 오류)
- 조회: `FOR155-404`(본인 지원서 없음 또는 회차 불일치), 회장단 아님은 `FOR020-403`
- 관리자 목록은 `application_id DESC` 고정이며 `sort`를 받지 않는다. `page`가 있으면
  0-based offset, 없으면 cursor 방식이다.
- 부서 필터의 문서 표기는 `department_id`였지만 backend `d657458`의 실제 Spring
  `@RequestParam` 이름은 `departmentId`다. frontend는 실제 실행 계약인 `departmentId`를
  사용한다. backend가 snake_case로 변경하면 계약 리비전과 함께 수정한다.

## 인증·라우팅 요구

1. `/club/recruit`와 `/hall-of-fame` 목록·공개 상세는 공개다.
2. 지원서 작성·본인 내역은 USER 인증이 필요하다.
3. 로그인 전 작성 진입 시 현재 host의 허용된 내부 경로만 복귀 대상으로 저장한다.
4. admin 앱의 전역 `ADMIN` 경계는 유지한다.
5. 회장단·reviewer 권한은 모든 backend 요청에서 다시 검사한다.
6. reviewer가 sidebar에서 지원서 메뉴를 볼 수 있어도 모집 수정·초대·전시 권한은 얻지 않는다.
7. USER reviewer를 채택할 경우 현재 admin middleware 구조를 바꿔야 하므로 별도 계약 변경으로 처리한다.

### 4단계 frontend 임시 연결 계약

backend 4단계 구현 전까지 아래 shape는 `staff-hall-contract-r2`의 제안 계약으로만 사용한다.
실제 backend DTO가 확정되면 endpoint와 필드 이름을 함께 대조하며, 현재 구현만으로 연동
완료를 주장하지 않는다.

```ts
type StaffReviewerStatus = "ACTIVE" | "REVOKED" | "EXPIRED";

interface StaffReviewerCandidate {
  user_id: number;
  user_name: string;
  department: string | null;
  affiliation: string;
  has_admin_account: boolean;
  reviewer_status: StaffReviewerStatus | null;
}

interface StaffRecruitmentReviewer {
  user_id: number;
  user_name: string;
  department: string | null;
  affiliation: string;
  status: StaffReviewerStatus;
  granted_at: string;
  expires_at: string;
  revoked_at: string | null;
}
```

- 부여 요청은 `{ user_id, expires_at }`이며 이름으로 식별하지 않는다.
- 기존 ADMIN과 회차 학기 운영진의 교집합만 후보로 반환한다고 가정한다.
- 부여는 수락 절차 없이 즉시 적용하며 전역 ADMIN role은 변경하지 않는다.
- 일반 web 초대·수락 화면은 만들지 않는다.
- 일반 ADMIN reviewer가 `/staff-applications?recruitmentId={id}`로 직접 접근하면 backend가
  해당 회차 grant를 검사한다. reviewer가 접근 가능한 회차를 스스로 찾는 API나 알림
  경로는 아직 계약에 없으므로 backend 4단계에서 확정해야 한다.

### 5단계 frontend 임시 연결 계약

backend 5단계 구현 전까지 아래 경로와 body는 `staff-hall-contract-r2` 제안 계약이다.
frontend 구현만으로 실제 연동 완료를 주장하지 않으며 backend DTO가 확정되면 함께 대조한다.

| 동작      | method·path                                            | frontend 요청·처리                   |
| --------- | ------------------------------------------------------ | ------------------------------------ |
| 관리 목록 | `GET /api/v1/admin/hall-of-fame?page=0&size=100`       | 모든 상태, `no-store`                |
| 초안 생성 | `POST /api/v1/admin/hall-of-fame`                      | 아래 저장 body, 생성 결과 반환       |
| 수정      | `PATCH /api/v1/admin/hall-of-fame/{entry_id}`          | 저장 body + `version`                |
| 이미지    | `POST /api/v1/admin/hall-of-fame/{entry_id}/image`     | multipart `file`, `{image_url}` 반환 |
| 게시      | `POST /api/v1/admin/hall-of-fame/{entry_id}/publish`   | `{version}`                          |
| 게시 중단 | `POST /api/v1/admin/hall-of-fame/{entry_id}/unpublish` | `{version}`                          |

저장 body는 `user_id`, `slug`, `act_year`, `act_semester`, `title`, `introduction`,
`display_order`, 순서가 포함된 `badges`, `achievements`를 사용한다. slug는 영문 소문자·숫자·하이픈
3~80자, 배지는 최대 10개·각 30자, 성취는 최대 20개, 외부 링크는 `https`만 허용한다.
이미지는 선택이며 frontend는 5MB 초과 파일을 먼저 차단한다. 서버는 크기·MIME·실제 파일 내용을
다시 검증해야 한다.

공개용 `HallOfFameEntry`에는 관리자 `publication_status`와 optimistic lock `version`을 포함하지
않는다. admin 응답만 이를 추가한 `AdminHallOfFameEntry`를 사용한다. 관리 미리보기는 admin 응답으로
렌더링하며 공개 조회 실패를 초안 API로 우회하지 않는다.

현재 frontend route와 sidebar는 회장·부회장 세션에만 노출한다. 최종 권한은 backend가 기존
회장단 검증으로 모든 요청마다 확인해야 한다. 일반 ADMIN 편집 허용 여부가 달라지면 route 표시와
서버 권한을 같은 계약 리비전에서 변경한다.

## 백엔드 확정 요청

- 실제 endpoint와 request/response 전체 예시
- 공개/접수/마감/취소 상태 기계와 시간 경계
- 문항 변경·제출 snapshot·동시 수정 처리
- 기존 회원 데이터에서 정회원을 판정하는 정확한 조건
- 한 회차당 한 지원서의 DB 제약과 1·2지망 저장·검증 규칙
- reviewer 대상·만료·회수·이해충돌과 요청별 인가
- 개인정보·답변·지망 영구 보관 구조, 자동 삭제 작업 미구현, 접근·감사·backup 보호
- 목록 pagination·정렬·검색·필터 이름
- 전시 slug·시즌·정렬·이미지·게시 조건
- API별 cache header와 전체 오류 코드
