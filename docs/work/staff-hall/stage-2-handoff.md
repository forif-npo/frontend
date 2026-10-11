# 2단계 backend 인계 — 황재환

```text
계약 ID: staff-hall-contract-r1
frontend 기준: local dev (origin/dev da12bca 기준) + 2단계 커밋
backend 참고: local dev 6e1f75b 문서 commit, 원격 미게시
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
backend 구현 뒤 설정→홈 배너→/club/recruit 반영을 함께 검증해야 함.
```
