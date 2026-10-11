# 1단계 PR 초안

코드 변경이 없는 조사·계약 문서 단계다. PR 게시는 요청하지 않았으며 실제 PR은 없다.

## 제목

```text
docs: 운영진 지원·명예의 전당 프론트 설계 초안 추가
```

## 본문

```markdown
## 변경 목적과 결과

운영진 지원과 명예의 전당 개발 전에 기존 frontend 구조와 backend/dev API 현황을 조사했습니다.
admin·web 화면 배치, 재사용 대상, 상태별 UI, 최소 API 요구를 문서화했습니다.

현재 계약은 `staff-hall-contract-r0-front-draft`이며 frontend 요구 초안입니다. backend 검토와
회장단 운영 정책이 확정되기 전에는 실제 API 계약으로 사용하지 않습니다.

## 구현 범위와 재사용

- admin의 operators, admin-accounts, study-applications, products, semester 패턴 조사
- web의 홈 Carousel, QuickMenu, club/recruit, team, products, hackathon archive 패턴 조사
- 기존 `apiClient`, NextAuth, middleware, PageHeader, DataTable, form/dialog/card 재사용 경계 정의
- 신규 화면 route와 feature 소유 위치 제안
- 정상·로딩·빈 값·오류·권한 없음 상태 정의
- 로그인한 정회원, 회차당 1회·1지망/2지망, 지원서 개인정보 DB 영구 보관 정책 반영

애플리케이션 코드는 변경하지 않았습니다.

## API·권한 계약

- 계약: `staff-hall-contract-r0-front-draft` / 미합의
- dev OpenAPI와 local backend에는 신규 API가 없음을 확인했습니다.
- admin의 기존 ADMIN 인증 경계를 유지하고, 회장단·회차별 reviewer 권한은 backend가 요청마다
  검사하도록 요구했습니다.
- 운영진 지원 부서는 대학 학과와 분리하고, 스터디 지원서 데이터를 전용하지 않도록 했습니다.
- 비공개 첨부는 공개 `/api/v1/files/**`를 사용할 수 없음을 기록했습니다.

## 검증

- local frontend/backend source 및 Git 상태 확인
- 2026-10-11 dev OpenAPI 조회
- local web/admin dev server 실행
- 홈, 모집 안내, 운영진 소개, 서비스, 해커톤 아카이브의 기존 렌더링 확인
- admin 보호 route가 비로그인 사용자를 `/signin`으로 보내는지 확인

문서만 변경했으므로 lint/type-check/test는 실행하지 않았습니다. 브라우저 도구가 정확한 viewport
override를 제공하지 않아 390/768/1440 실제 렌더링 검증은 UI 구현 단계로 이월합니다.

## 배포 영향과 남은 사항

배포 영향과 환경 변수 변경은 없습니다.

- 회장단의 제출 수정·취소·첨부, reviewer 이해충돌, 전시 선정·편집 정책 확정 필요
- backend 모델·endpoint·상태·권한·오류 코드 확정 필요
- 양 저장소 계약을 `staff-hall-contract-r2`로 동기화한 뒤 2단계 backend 구현 가능
```
