# 2단계 실제 연동 결과 — 황재환 전달용

## 기준

- 계약: `staff-hall-contract-r2`
- frontend: `dev` / `0eb488b` + 미커밋 실계약 보정
- backend: `feature/staff-recruitment-application` / `d657458`
- backend 2단계 구현: `38a24d1`
- 확인일: 2026-10-13 (Asia/Seoul)

## frontend에 반영한 실제 계약

- 공개 응답과 관리 응답을 분리했다. 공개 응답에는 `version`, `ended_at`, `close_reason`이 없고 관리 응답에는 필수 `version`이 있다.
- `description`은 공개·관리 응답에서 `null`일 수 있다.
- create/patch의 `departments`, `questions`는 전체 교체 배열이며 기존 ID를 요청에 보내지 않는다.
- PATCH와 publish/close/cancel에 최신 `version`을 필수로 보낸다.
- 관리자 목록은 서버의 `recruitment_id DESC` 고정 정렬을 사용하며 지원하지 않는 sort 파라미터를 제거했다.
- close/cancel의 `reason`은 선택 값으로 유지한다.

## 실제 연동 증거

- MySQL 8(`3307`)·Redis 7(`6379`)과 backend `local` 프로파일 기동 성공.
- `GET /api/v1/staff-recruitments/current`: 회차 없음 `200 + data:null`, `Cache-Control: no-cache`.
- 무인증 관리자 목록: `401/FOR017-401`.
- 없는 공개 회차: `404/FOR148-404`.
- 관리자 목록 → 생성(`201/DRAFT/v0`) → 수정(`200/v1`) → 게시(`PUBLISHED/v2`) → 공개 조회(`OPEN`) → 마감(`CLOSED/v3`) 통과.
- 공개 응답에서 `version` 미포함, 관리 응답에서 최신 `version` 포함 확인.
- 실제 공개 회차를 web dev 홈과 `/club/recruit`에서 SSR해 같은 제목·부서·문항·영구보관 안내를 확인했다.
- 마감 직후 홈과 모집 안내에서 오래된 회차가 제거되고 홈의 다른 섹션이 `200`을 유지했다.

검증용 회차 2건은 로컬 DB에 `CLOSED`로 남겼다. 검증 중 일시 변경한 운영진 소속은 원래 바이트 값으로 복구했다. 토큰·비밀번호·실제 개인정보는 문서에 남기지 않았다.

## 남은 확인

- 인증된 admin 브라우저에서 폼을 직접 클릭하는 수동 검증은 유효 세션 자동화가 없어 미실행이다.
- 390/768/1440 viewport 시각 비교는 브라우저 연결 실패로 남아 있다.
- dev 배포·OpenAPI 반영 여부는 로컬 feature 연동과 별개로 배포 후 확인해야 한다.

## 다음 단계 시작점

한지석 3단계는 backend `d657458`의 지원서 제출·본인 조회·회장단 목록/상세 계약부터 대조하면 된다. 개인정보·답변·지망은 DB 영구 보관이고 기간 기반 자동 삭제는 없다.
