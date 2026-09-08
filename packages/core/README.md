# `@repo/core`

FORIF 서비스의 공통 도메인 타입, Zod 스키마, 상태 라벨, 폼 상수, API 유틸리티를 제공하는
패키지입니다.

## 사용 범위

- `schemas`: 회원가입, 스터디 신청·개설 등 입력 검증
- `types`: API 응답과 도메인 타입
- `utils`: API client, 오류 처리, 파일 다운로드, 전화번호·조사 처리
- 도메인 상수: 스터디·해커톤·상품의 상태와 선택지

앱에서는 `@core/*` 경로로 필요한 모듈만 import합니다.

```ts
import { signUpSchema } from "@core/schemas";
import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
```

## 변경 기준

- API 타입과 요청·응답 형식은 [FORIF Scalar](https://dev.forif.org/scalar)와 함께 검토합니다.
- 앱 전용 화면 상태와 UI 컴포넌트는 이 패키지에 추가하지 않습니다.
- 공통 유틸리티와 스키마 변경은 사용하는 앱의 동작과 테스트를 함께 확인합니다.

## 검증

```bash
pnpm --filter @repo/core lint
pnpm --filter @repo/core type-check
pnpm --filter @repo/core test
```
