# 프론트엔드 구조

## 책임 경계

| 위치                    | 책임                                       |
| ----------------------- | ------------------------------------------ |
| `apps/web`              | 부원·멘토 서비스의 라우트와 기능           |
| `apps/admin`            | 운영진 관리 서비스의 라우트와 기능         |
| `packages/core`         | 앱과 독립적인 도메인 타입·스키마·유틸리티  |
| `packages/ui`           | web·admin에서 검증된 공통 UI와 디자인 토큰 |
| `packages/big-calendar` | 독립적으로 관리하는 캘린더 UI·상태·스키마  |
| `packages/*-config`     | lint·TypeScript·스타일 도구 설정           |

web과 admin은 서로의 소스 코드를 직접 import하지 않습니다. 공유가 필요하면 성격에 따라
`core` 또는 `ui`로 추출합니다.

## 기능을 찾고 배치하는 순서

1. `apps/*/src/app`에서 URL, route, 권한·데이터 진입점을 찾습니다.
2. `src/features/<feature>`에서 화면, 상태, API 흐름을 관리합니다.
3. API 형식과 검증은 `packages/core`의 타입·스키마와 Scalar 계약을 함께 확인합니다.
4. 두 앱에서 실제로 공유하는 UI가 필요할 때만 `packages/ui`를 사용하거나 확장합니다.

route는 데이터 진입·메타데이터·권한 경계·feature 조합을 맡습니다. 복잡한 상호작용과
도메인 로직은 feature에 둡니다. feature끼리는 내부 구현을 직접 깊게 import하지 않습니다.

---

작성일시: 2026-09-16  
최종 편집일시: 2026-09-16
