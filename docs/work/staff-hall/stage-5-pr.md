# 5단계 frontend PR 초안

복사용 초안이며 게시하지 않음.

## 제목

```text
feat: 명예의 전당 콘텐츠 관리 및 게시 UI 추가
```

## 본문

```markdown
## 변경 목적과 결과

회장단이 명예의 전당 인물과 성취를 초안으로 등록하고, 관리자 미리보기 후 게시하거나 게시를 중단할 수 있는 frontend 흐름을 추가했습니다.

## 변경 범위

- admin: `/hall-of-fame` 목록·등록·수정·미리보기·게시/중단, 회장단 sidebar 메뉴
- web: 6단계 공개 화면에서 사용할 인물 카드 기반만 추가하고 route·메뉴는 노출하지 않음
- core: 공개 표시 계약과 admin 상태/version 계약 분리
- docs: 5단계 진행 기록·계약·backend 인계 갱신

## 기존 구현 재사용

기존 admin page container·PageHeader·Button·Dialog·폼 입력과 상품 이미지 multipart 업로드 패턴을 재사용했습니다. 별도 편집기나 UI 라이브러리는 추가하지 않았습니다.

## API·권한·연동

`staff-hall-contract-r2` 제안 경로로 관리 목록, 생성·수정, 이미지, 게시·게시 중단 adapter를 구현했습니다. route와 sidebar는 회장·부회장만 표시하고 최종 권한은 backend 검사를 전제로 합니다. backend 5단계 미구현으로 실제 API 연동은 대기입니다.

## 검증

- core/admin/web type-check 통과
- 변경 파일 lint 통과
- admin 관련 Jest 3 suites, 8 tests 통과
- 전체 lint·type-check 통과. 전체 test의 기존 5개 병렬 실패는 각 suite 단독 재실행 통과
- production build의 web 30개·admin 29개 페이지 생성 통과, 최종 standalone symlink 복사는 Windows `EPERM`으로 실패
- 비로그인 `/hall-of-fame` 접근 시 `/signin` 이동 확인
- 회장단 세션·backend API 부재로 인증 후 390/768/1440 화면과 실제 게시 왕복은 미실행

## 배포 영향과 남은 사항

backend 전시 migration·관리/공개 API가 먼저 배포되어야 합니다. 당사자 공개 동의·철회와 게시 중단 cache 정책을 출시 전에 확정해야 합니다. 공개 명예의 전당 route와 메뉴는 6단계에서 실제 게시 API와 함께 연결합니다.
```
