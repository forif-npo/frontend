# `@repo/tailwind-config`

FORIF workspace에서 사용하는 공통 PostCSS 설정 패키지입니다.

## 사용

web, admin, `@repo/ui`의 PostCSS 설정은 아래 경로를 사용합니다.

```js
import { postcssConfig } from "@repo/tailwind-config/postcss";

export default postcssConfig;
```

## 변경 기준

- PostCSS 플러그인 변경은 web, admin, `@repo/ui`의 스타일 빌드에 영향을 줍니다.
- 설정 변경 뒤에는 영향을 받는 앱의 빌드와 UI 상태를 확인합니다.
