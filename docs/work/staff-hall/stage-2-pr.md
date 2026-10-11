# 2단계 PR 초안

## 제목

```text
feat: 운영진 모집 설정과 공개 안내 화면 추가
```

## 본문

```markdown
## 변경 목적과 결과

회장단이 운영진 모집의 안내·기간·부서·문항을 설정하고 공개·마감·취소할 수 있는 화면을 추가했습니다. 일반 웹은 현재 공개 모집을 홈 배너와 `/club/recruit`에서 동일하게 보여주며, 모집 없음과 API 오류를 구분합니다.

## 변경 범위

- admin: `/staff-recruitments` 회장단 권한 경계, 모집 목록·폼·상태 action, sidebar 메뉴
- web: 현재 모집 API adapter, 동적 홈 Carousel 배너, 모집 안내의 예정/진행/마감/취소/없음/오류 상태
- core: `staff-hall-contract-r1` snake_case 공유 타입과 package export
- docs: 계약 r1 동기화, 진행표, PR·backend 인계 자료

## 기존 구현 재사용

- admin `PageHeader`, Button/Input/Select/Textarea/Dialog/Badge와 기존 회장단 affiliation 표시 패턴
- web `Carousel`, `PageHeader`, `PageState`, 기존 QuickMenu `/club/recruit` 링크
- 공통 `ApiResponse`, `CursorPageResponse`, `apiClient`, `handleApiError`

## API·권한·연동

- 계약: `staff-hall-contract-r1`
- 공개: `GET /api/v1/staff-recruitments/current`
- 관리: `/api/v1/admin/staff-recruitments` CRUD 및 publish/close/cancel action
- UI는 회장·부회장에게만 메뉴와 설정 화면을 보이지만 최종 권한은 backend 403을 사용합니다.
- backend API가 아직 dev에 없어 실제 데이터 연동은 대기 상태입니다. 가상 production fallback은 추가하지 않았습니다.

## 검증

- lint: core/web/admin 통과
- type-check: core/web/admin 통과
- 신규 web/admin Jest 8개 통과
- core 전체 42개, web 전체 157개 테스트 통과
- admin 전체 161개 중 159개 통과. 변경하지 않은 semester 기존 테스트 2건이 병렬 실행에서 실패했고, 단독 재실행에서는 1건 통과·1건 5초 timeout 실패
- web/admin production build는 컴파일·타입 검사·정적 페이지 생성까지 통과. 마지막 standalone trace는 Windows symlink 권한 `EPERM`으로 실패
- 로컬 web dev server 기동 성공
- 로컬 HTTP `/`, `/club/recruit` 200 확인
- Codex in-app browser attach timeout으로 390/768/1440 시각 검증 미실행
- 유효 ADMIN 세션과 backend API가 없어 실제 어드민 설정→공개 반영 미실행

## 배포 영향과 남은 사항

공통 package export를 포함한 web/admin 컴파일·타입 검사·정적 페이지 생성은 통과했습니다. Windows에서 symlink 생성이 허용되는 환경에서 standalone 패키징을 다시 확인해야 합니다. backend 모집 API를 먼저 구현·배포한 뒤 frontend를 연동 검증해야 합니다. 관리 create/patch의 embedded 부서·문항 ID 규칙과 action 응답은 OpenAPI 제공 시 다시 대조합니다. 3단계 전까지 지원 버튼은 비활성 안내로 유지합니다.
```

복사용 초안이며 게시하지 않았다.
