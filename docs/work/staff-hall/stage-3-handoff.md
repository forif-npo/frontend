# 3단계 frontend 구현 결과 — 다음 작업자 전달용

## 기준

- 계약: `staff-hall-contract-r2`
- frontend: `dev` / `8f90e06` + 미커밋 3단계 구현
- backend: `feature/staff-recruitment-application` / `d657458`
- 확인일: 2026-10-14 (Asia/Seoul)

## 구현 완료

- 지원자는 공개 모집에서 로그인 후 원래 지원 경로로 안전하게 복귀한다. 외부 URL과
  protocol-relative URL은 `/`로 치환한다.
- 서버 부서·문항으로 즉시 제출 폼을 구성한다. 1지망은 필수, 2지망은 선택이며 중복 부서를
  막는다. 필수 답변과 `max_length`를 검증하고 제출 중 버튼을 잠근다.
- 성공하면 회차별 본인 상세로 이동한다. 중복 제출이면 기존 상세로 이동할 수 있고,
  접수 마감·자격 없음·지망/답변 오류·세션 오류는 구분해 표시한다.
- 실패해도 입력은 현재 React state에 유지한다. localStorage/sessionStorage/URL/log에는
  답변이나 연락처를 넣지 않는다.
- 회장단은 `/staff-applications`에서 회차·부서·이름으로 서버 필터링하고 목록 행을 눌러
  연락처와 답변 상세를 확인한다. 목록에는 연락처·답변을 포함하지 않는다.

## 실제 backend 계약 주의점

- 본인 조회: `GET /api/v1/staff-recruitments/{recruitmentId}/applications/me`
- 관리자 목록/상세:
  `/api/v1/admin/staff-recruitments/{recruitmentId}/applications[/{applicationId}]`
- 목록은 `application_id DESC` 고정, `page`는 0-based, `size` 최대 100이다.
- 부서 필터의 실제 Spring 파라미터는 `departmentId`다. 이전 문서의 `department_id`를
  그대로 보내면 필터가 적용되지 않는다.
- 지원서는 즉시 제출만 지원한다. 임시저장·수정·취소·재지원·첨부는 구현하지 않았다.
- 개인정보 snapshot·답변·지망은 DB 영구 보관이다.

## 검증 결과

- web 46 suites/164 tests, admin 56 suites/171 tests와 양쪽 type-check 통과.
- production build는 컴파일·타입 검사·정적 페이지 생성까지 통과하고 Windows symlink
  권한 때문에 standalone trace 단계에서만 실패했다.
- 로컬 MySQL·Redis·backend를 기동해 제출 → 순차/동시 중복 → 본인 조회 → 관리자
  목록/상세 → 모집 마감 후 제출을 실제 HTTP로 확인했다. 개인정보 조회 응답은 모두
  `Cache-Control: no-store, private`였다.
- 1001자 답변 거부와 1000자 정상 제출, 자격 미달, 동시 요청의 단일 성공을 확인했다.
- 브라우저에서 실제 공개 모집, 지원 CTA, 안전한 로그인 복귀 URL과 admin 인증 경계를
  확인했다. 390/768/1440px 모두 가로 넘침이 없었다.
- 실제 운영진 비밀번호와 Google OAuth 세션은 사용하지 않았다. 인증 뒤 화면 클릭은 실제
  API 검증과 전체 자동 테스트로 대체했으며, 사용자 계정 기반 수동 인수 확인은 별도다.
- 로컬 Flyway history가 V1 이후 정상 적용되지 않아 Hibernate가 만든 지원서 테이블에 V6의
  중복 방지 unique key가 빠져 있었다. 로컬 DB에만 해당 key를 보완한 뒤 동시 요청이
  `201/409`로 동작함을 확인했다. 배포 환경은 V6 적용 여부를 출시 전에 확인해야 한다.
- 4단계는 reviewer 계약을 확정한 뒤 시작한다. 현재 관리자 지원서 열람은 회장단만 가능하다.
