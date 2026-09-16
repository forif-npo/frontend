# API 연동 컨벤션

최신 API 계약의 기준은 [FORIF Scalar](https://dev.forif.org/scalar)입니다. API를 추가하거나
변경할 때는 Scalar의 경로·인증 요구·요청·응답 필드와
`packages/core/src/types/api.d.ts`, 호출 코드를 함께 확인합니다.

## 규칙

- 백엔드 요청·응답 필드는 `snake_case`를 그대로 사용합니다.
- 공유 API 타입·Zod schema·도메인 유틸리티는 `packages/core`에 둡니다.
- 한 앱의 화면 흐름에만 필요한 API 조합·mutation 상태는 해당 feature에 둡니다.
- 인증, 권한, 데이터 형식, API 계약을 바꾸는 PR은 영향받는 사용자 흐름과 오류·권한 없는 경우를 명시합니다.
- 응답 형식이 불확실하면 추측으로 타입을 넓히지 말고 Scalar와 백엔드 담당자에게 확인합니다.

API 형식 변경은 프론트와 백엔드의 공동 계약 변경입니다. 호환성, 배포 순서, 롤백 가능성을
PR에서 먼저 합의합니다.

---

작성일시: 2026-09-16  
최종 편집일시: 2026-09-16
