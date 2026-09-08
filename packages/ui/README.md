# `@repo/ui`

FORIF web과 admin에서 사용하는 공통 UI 컴포넌트와 디자인 토큰 패키지입니다.

## 공개 경로

| 경로                         | 내용                                          |
| ---------------------------- | --------------------------------------------- |
| `@repo/ui/components/server` | 서버 컴포넌트에서 사용할 수 있는 표현·상태 UI |
| `@repo/ui/components/client` | 상호작용이 있는 UI                            |
| `@repo/ui/theme.css`         | 색상, 간격, 타이포그래피 토큰                 |
| `@repo/ui/styles.css`        | 빌드된 공통 스타일                            |
| `@repo/ui/colors`            | 차트 등 코드 기반 색상 표현                   |

앱 내부 TypeScript 경로 별칭에서는 `@ui/components/server`, `@ui/components/client`를
사용할 수 있습니다.

## 사용 기준

- UI는 component variant와 semantic token을 사용합니다.
- web과 admin의 재사용 근거가 있는 UI를 이 패키지에 추가합니다.
- 앱 전용 화면 조합과 비즈니스 로직은 해당 앱에서 관리합니다.
- 컴포넌트의 DOM 구조, 키보드 동작, label, role은 공개 UI 계약으로 관리합니다.

세부 기준은 [REFACTORING.md](../../REFACTORING.md)를 따릅니다.

## 검증

```bash
pnpm --filter @repo/ui lint
pnpm --filter @repo/ui type-check
pnpm --filter @repo/ui build
```
