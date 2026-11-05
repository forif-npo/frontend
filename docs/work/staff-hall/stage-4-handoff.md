# 4단계 frontend 구현 결과 — backend 전달용

## 기준

- 계약: `staff-hall-contract-r2` 제안 계약
- frontend: `dev` / `4a27f98` + 미커밋 4단계 구현
- backend: `feature/staff-recruitment-application` / `d657458`
- 확인일: 2026-10-14 (Asia/Seoul)

## frontend 구현

- 회장단 전용 `/staff-recruitments/{recruitmentId}/reviewers` 화면
- 활동 학기 운영진 후보 검색, ADMIN 계정 여부와 기존 상태 표시
- `user_id`와 필수 `expires_at`을 사용하는 즉시 부여
- active/revoked/expired 이력 표시와 active 권한 회수
- 일반 ADMIN에게 지원서 메뉴를 노출하고 backend 회차 권한에 따라 목록·상세 허용
- 목록 또는 상세에서 403을 받으면 이전 개인정보 상태를 즉시 비우고 권한 없음 표시
- 일반 web의 초대 수락 화면은 제외

## 필요한 backend 계약

1. 다음 네 endpoint와 전체 DTO·오류 코드를 구현·확정해야 한다.
   - `GET /api/v1/admin/staff-recruitments/{id}/reviewer-candidates`
   - `GET /api/v1/admin/staff-recruitments/{id}/reviewers`
   - `POST /api/v1/admin/staff-recruitments/{id}/reviewers`
   - `DELETE /api/v1/admin/staff-recruitments/{id}/reviewers/{userId}`
2. 후보는 회차 학기 운영진과 현재 ADMIN 계정의 교집합으로 제한한다.
3. grant는 JWT role을 바꾸지 않고 회차별 DB 권한으로 즉시 적용한다.
4. 지원서 목록·상세의 매 요청에서 active·expiry·revoke와 같은 회차인지 검사한다.
5. 같은 회차 지원자와 reviewer 이해충돌 정책을 확정하고 서버에서 강제한다.
6. 일반 reviewer가 자신이 열람할 수 있는 회차를 찾을 방법이 필요하다. 기존 관리자 모집
   목록을 권한별로 제한해 반환하거나 별도 `reviewable-recruitments` endpoint/초대 전달
   경로 중 하나를 계약에 추가해야 한다.

## frontend 임시 DTO

- candidate: `user_id`, `user_name`, `department`, `affiliation`,
  `has_admin_account`, `reviewer_status`
- reviewer: candidate 표시 필드 + `status`, `granted_at`, `expires_at`, `revoked_at`
- status: `ACTIVE | REVOKED | EXPIRED`
- grant request: `{ user_id, expires_at }`

backend DTO가 다르면 구현 커밋과 함께 차이를 전달해야 한다. frontend는 그 커밋을 기준으로
타입·adapter를 맞추고 실제 초대 → 열람 → 회수/만료 → 403을 검증한다.
