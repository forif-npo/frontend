# 4단계 PR 초안

## 제목

```text
feat: 운영진 지원서 회차별 열람자 관리 추가
```

## 본문

```markdown
## 결과

회장단이 모집 회차별 지원서 열람자를 검색·부여·회수하고, 일반 ADMIN reviewer가 해당
회차 지원서만 열람할 수 있는 frontend 경계를 추가했습니다.

## 주요 변경

- 회장단 전용 열람자 관리 route와 모집 관리 진입점
- 운영진 후보 검색, ADMIN 계정/기존 grant 상태, 필수 만료 시각
- `user_id` 기반 즉시 부여와 확인 후 회수
- active/revoked/expired 이력 표시
- reviewer용 지원서 메뉴와 회차별 backend 인가 유지
- 403 발생 시 지원서 목록·상세 개인정보 상태 제거
- reviewer 공통 타입, API adapter와 계약 테스트

## 검증

- core/web/admin type-check 통과
- 관련 Jest 2 suites/10 tests, admin 전체 57 suites/176 tests 통과
- 비로그인 열람자 관리 URL의 admin 로그인 redirect 확인
- backend reviewer API가 없어 실제 초대·회수 왕복은 연동 대기

## 정책·보안

- 기존 ADMIN 운영진만 대상이며 전역 role을 새로 부여하지 않음
- 부여는 즉시 적용하고 일반 web 수락 화면은 만들지 않음
- 최종 후보·이해충돌·회수·만료·회차 권한은 backend가 요청마다 검사
- 개인정보를 cache하거나 권한 거절 뒤 화면 state에 유지하지 않음
```

복사용 초안이며 PR은 생성하지 않았다.
