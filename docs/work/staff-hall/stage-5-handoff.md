# 5단계 frontend 구현 결과 — backend 전달용

## 기준

- 계약: `staff-hall-contract-r2` 제안 계약
- frontend: `dev` / `80d115f` + 미커밋 4·5단계 연동 보완
- backend: `fix/staff-hall-integration-verification` / `e0dca45`
- 확인일: 2026-10-17 (Asia/Seoul)

## frontend 구현

- 회장단 전용 `/hall-of-fame` 관리 화면과 sidebar 진입
- 회원 검색·선택, 시즌, slug, 제목, 소개, 배지, 성취, 이미지, 노출 순서 편집
- 관리자 응답 기반 미리보기, 초안 생성·수정, 게시·게시 중단
- 이미지 5MB 선검증과 multipart 업로드
- 공개 표시 타입과 admin 상태/version 분리
- 6단계용 web 카드 기반 추가, 공개 route·메뉴는 미노출

## 반영한 backend 5단계

1. `GET/POST /api/v1/admin/hall-of-fame`
2. `GET/PATCH /api/v1/admin/hall-of-fame/{entry_id}`
3. `POST /api/v1/admin/hall-of-fame/{entry_id}/image`
4. `POST /api/v1/admin/hall-of-fame/{entry_id}/publish`
5. `POST /api/v1/admin/hall-of-fame/{entry_id}/unpublish`
6. `GET /api/v1/hall-of-fame`, `GET /api/v1/hall-of-fame/{slug}`

관리 목록은 `CursorPageResponse<AdminHallOfFameEntry>`로 `page=0&size=100`을 보낸다.
생성·수정은 `member_user_id`, `member_name`, `headline`, 문자열 `badges`를 사용하고 관리 상태는
`status`로 읽는다. 수정·게시·중단은 `version` 기반 충돌 검사를 사용한다. 이미지 응답의
`{image_url, version}`도 보존한다.

## 남은 통합 QA

- 인증된 회장단 브라우저에서 등록 → 미리보기 → 게시 → 게시 중단 클릭 검증
- 실제 S3 이미지 업로드 후 응답 `version`으로 다음 수정·게시가 이어지는지 확인
- 당사자 공개 동의·철회 절차 확정

backend는 로컬 실제 HTTP로 게시 → 공개 조회 → 게시 중단 → 공개 404를 검증했다. frontend는
실제 DTO 차이를 반영하고 관련 자동 검증을 통과했으며, 위 인증 브라우저·S3 확인은 7단계에서 수행한다.
