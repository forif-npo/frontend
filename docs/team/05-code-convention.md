# 코드 컨벤션

## 이름과 파일

| 대상                                     | 규칙                        | 예시                         |
| ---------------------------------------- | --------------------------- | ---------------------------- |
| 디렉터리                                 | 소문자 kebab-case           | `study-manage`               |
| React 컴포넌트 파일·export               | PascalCase                  | `StudyCard.tsx`, `StudyCard` |
| hook 파일·export                         | `use` + PascalCase          | `useStudyData.ts`            |
| 변수·매개변수·내부 property·import alias | camelCase                   | `selectedStudy`, `onSubmit`  |
| 순수 함수                                | camelCase 동사              | `formatPhoneNumber`          |
| 타입·interface·class·enum·type parameter | PascalCase 명사             | `SubmissionRequest`, `TData` |
| 의미가 안정된 상수                       | UPPER_SNAKE_CASE            | `STUDY_TAG_OPTIONS`          |
| 테스트                                   | 대상 옆 `<name>.test.ts(x)` | `StudyCard.test.tsx`         |

새 코드와 수정하는 주변 코드에 적용합니다. 규칙만을 이유로 대규모 파일 이동이나 이름 변경을
하지 않습니다. 백엔드 요청·응답 DTO의 property는 API 계약에 따라 이 규칙의 예외로
`snake_case`를 유지합니다.

## 구현 기준

- 화면에서 한 기능 용어를 아는 코드는 그 feature 가까이에 둡니다.
- 재사용 가능해 보인다는 이유만으로 공통 패키지에 올리지 않습니다. web과 admin의 실제 공통 소비자 또는 독립적인 공개 계약이 있을 때만 승격합니다.
- `packages/core`에는 UI 없는 도메인 계약·스키마·순수 유틸리티를, `packages/ui`에는 재사용 근거가 있는 UI primitive와 토큰을 둡니다.
- Server Component는 서버 데이터·권한·초기 조합을 맡고, browser API·이벤트·client state가 필요한 부분만 Client Component로 좁힙니다.
- 컴포넌트의 DOM 구조, 키보드 동작, label과 role은 외부 사용자가 의존하는 계약입니다.
- 백엔드 요청·응답 필드는 프론트에서 임의로 camelCase로 바꾸지 않고 `snake_case`를 유지합니다.

---

작성일시: 2026-09-16  
최종 편집일시: 2026-09-16
