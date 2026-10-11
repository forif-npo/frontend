# 2단계 backend 인계 — 황재환

## 바로 시작할 때 읽을 파일

아래 순서로 읽으면 backend 2단계를 시작할 수 있다.

1. `C:/hanluta77/forif/황재환_Claude_단계별_작업지침.md` — backend 2단계 실행 규칙과 완료 기준
2. `C:/hanluta77/forif/황재환_한지석_8단계_작업프로세스.md` — 양쪽 담당 범위와 순서
3. `C:/hanluta77/forif/forif-backend/docs/work/staff-hall/contract.md` — `staff-hall-contract-r2` backend 정본
4. `C:/hanluta77/forif/forif-backend/docs/work/staff-hall/progress.md` — backend 1단계 결과와 2단계 시작 상태
5. 이 파일 — frontend가 실제 호출하도록 구현한 endpoint와 미확정 request 세부
6. `C:/hanluta77/forif/forif-frontend/docs/work/staff-hall/contract.md` — frontend 응답 필드·상태·화면 요구

`현재_API_프론트구조_및_기획서_검토.md`와 양쪽 `stage-1-handoff.md`는 조사 근거를 다시 확인할 때만 참고하면 된다. 2단계 시작을 위해 한지석용 단계별 지침이나 PR 초안을 다시 읽을 필요는 없다.

```text
계약 ID: staff-hall-contract-r2
frontend 기준: local dev 6fb6335 + 미커밋 r2 정책 문서
backend 참고: local dev 6e1f75b + 미커밋 r2 정책 문서
연동 상태: 화면·adapter 완료 / backend API 및 실제 연동 대기

구현한 요청:
- GET /api/v1/staff-recruitments/current (public, data:null 허용, no-cache)
- GET /api/v1/admin/staff-recruitments?page=0&size=100&sort=recruitmentId:DESC
- POST /api/v1/admin/staff-recruitments
- PATCH /api/v1/admin/staff-recruitments/{id}
- POST /api/v1/admin/staff-recruitments/{id}/publish|close|cancel

frontend가 사용하는 상태:
- publication_status: DRAFT | PUBLISHED | CLOSED | CANCELED
- application_status: UPCOMING | OPEN | CLOSED | CANCELED
- application_open과 application_unavailable_reason은 서버 값을 그대로 사용

확인이 필요한 request 세부:
- create/patch에 departments/questions를 embedded 배열로 보내는지
- 기존 department_id/question_id를 patch body에 포함하는 방식
- patch/publish/close/cancel의 version 필수 여부와 최신 version 응답
- close/cancel reason 필수 여부
- 관리자 목록 sort 필드명이 recruitmentId인지

검증용 API 상태 필요:
- 200 data:null
- UPCOMING/OPEN/CLOSED/CANCELED 공개 회차
- DRAFT/PUBLISHED/CLOSED/CANCELED 관리자 회차
- FOR149, FOR150, FOR151, FOR152, FOR020 오류

개인정보나 지원서 제출 API는 2단계에서 호출하지 않음.
지원서 개인정보 snapshot·답변·지망은 DB 영구 보관이며 기간 기반 자동 삭제 작업은 구현하지 않음.
backend 구현 뒤 설정→홈 배너→/club/recruit 반영을 함께 검증해야 함.
```
