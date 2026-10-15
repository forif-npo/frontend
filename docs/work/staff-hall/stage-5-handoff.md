# 5단계 frontend 구현 결과 — backend 전달용

## 기준

- 계약: `staff-hall-contract-r2` 제안 계약
- frontend: `dev` / `1d716a6` + 미커밋 5단계 구현
- backend: `feature/staff-recruitment-application` / `d657458`
- 확인일: 2026-10-15 (Asia/Seoul)

## frontend 구현

- 회장단 전용 `/hall-of-fame` 관리 화면과 sidebar 진입
- 회원 검색·선택, 시즌, slug, 제목, 소개, 배지, 성취, 이미지, 노출 순서 편집
- 관리자 응답 기반 미리보기, 초안 생성·수정, 게시·게시 중단
- 이미지 5MB 선검증과 multipart 업로드
- 공개 표시 타입과 admin 상태/version 분리
- 6단계용 web 카드 기반 추가, 공개 route·메뉴는 미노출

## 필요한 backend 5단계

1. `GET/POST /api/v1/admin/hall-of-fame`
2. `GET/PATCH /api/v1/admin/hall-of-fame/{entry_id}`
3. `POST /api/v1/admin/hall-of-fame/{entry_id}/image`
4. `POST /api/v1/admin/hall-of-fame/{entry_id}/publish`
5. `POST /api/v1/admin/hall-of-fame/{entry_id}/unpublish`
6. `GET /api/v1/hall-of-fame`, `GET /api/v1/hall-of-fame/{slug}`

관리 목록은 `CursorPageResponse<AdminHallOfFameEntry>`를 가정하고 `page=0&size=100`을 보낸다.
생성·수정 body와 제한은 frontend `contract.md`의 5단계 임시 계약을 참고한다. 수정·게시·중단은
`version` 기반 충돌 검사가 필요하다. 이미지 응답은 `{image_url}`을 가정한다.

## 확정 요청

- 생성·수정·목록·이미지의 실제 전체 DTO와 오류 코드
- 회원 검색 endpoint를 전시 인물 선택에 재사용해도 되는지
- 일반 ADMIN 편집 허용 여부. 현재 frontend는 회장·부회장만 허용
- 당사자 공개 동의·철회 절차와 게시 중단 후 public cache 최대 60초 허용 여부
- 이미지 허용 MIME·최대 크기·삭제/교체 규칙

backend 구현 커밋을 전달하면 frontend는 DTO 차이를 수정하고 등록 → 미리보기 → 게시 → 공개 조회 →
게시 중단 → 공개 404를 실제 API로 검증해야 한다.
