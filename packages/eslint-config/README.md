# `@repo/eslint-config`

FORIF workspace에서 공유하는 ESLint 설정 패키지입니다.

## 제공 설정

| Export                               | 용도                                |
| ------------------------------------ | ----------------------------------- |
| `@repo/eslint-config/next-js`        | Next.js 앱용 flat config            |
| `@repo/eslint-config/react-internal` | 내부 React 라이브러리용 flat config |
| `@repo/eslint-config/base`           | 공통 base config                    |
| `@repo/eslint-config/server`         | Node/server 환경 설정               |

web과 admin은 `next-js` 설정을 사용합니다.

```js
import { nextJsConfig } from "@repo/eslint-config/next-js";

export default nextJsConfig;
```

## 변경 원칙

- 공통 규칙 변경은 모든 소비 workspace에 영향을 준다는 점을 먼저 검토합니다.
- 앱별 예외는 해당 앱 설정에서 관리합니다.
- 새 규칙은 실제 위반 사례와 적용 대상의 lint 결과를 함께 확인합니다.
- 설정 변경 뒤에는 최소 `pnpm lint`를 실행합니다.
