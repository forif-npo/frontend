# `@repo/typescript-config`

FORIF workspace에서 공유하는 TypeScript 설정 패키지입니다. 각 workspace는 목적에
맞는 base config를 `extends`로 사용합니다.

## 제공 설정

| 파일                 | 용도                        |
| -------------------- | --------------------------- |
| `base.json`          | 공통 strict TypeScript 기준 |
| `nextjs.json`        | Next.js 앱 설정             |
| `react-library.json` | React 라이브러리 설정       |

Next.js 앱의 예시는 다음과 같습니다.

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }]
  }
}
```

## 변경 원칙

- 공통 설정 변경은 모든 workspace의 타입 검사와 빌드에 영향을 줍니다.
- 앱별 compiler option은 해당 앱의 `tsconfig.json`에서 관리합니다.
- 설정 변경 뒤에는 최소 `pnpm type-check`를 실행하고, Next.js 설정을 바꿨다면
  관련 앱 빌드도 확인합니다.
