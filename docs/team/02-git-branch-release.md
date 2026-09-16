# Git 브랜치·릴리즈 전략

## 영구 브랜치

| 브랜치    | 역할                            | 변경 유입                           |
| --------- | ------------------------------- | ----------------------------------- |
| `main`    | 실제 배포가 완료된 제품 기준선  | `release` 승격 PR                   |
| `release` | Production 배포 대상            | `dev` 승격 PR, `hotfix/*` PR        |
| `dev`     | 기능 통합과 Preview 검증 기준선 | 작업 브랜치 PR, `release` 동기화 PR |

영구 브랜치에는 직접 push하지 않고 PR로만 변경합니다. 작업 브랜치는 병합 뒤 삭제합니다.

## 작업 브랜치

일반 작업은 `dev`에서 분기해 `dev`로 PR을 만듭니다. 이름은
`접두사/이슈-짧은-설명`을 사용하며, 이슈가 없으면 이슈 번호를 생략합니다.

| 접두사      | 용도                           |
| ----------- | ------------------------------ |
| `feat/`     | 사용자 기능                    |
| `fix/`      | 일반 결함 수정                 |
| `refactor/` | 제품 계약을 유지하는 구조 개선 |
| `docs/`     | 문서와 개발 흐름               |
| `chore/`    | 개발 도구와 저장소 유지보수    |
| `hotfix/`   | 운영 서비스 긴급 수정          |

예: `feat/FOR-123-study-apply`, `fix/login-redirect`

## PR 전 동기화·검증·병합

- PR을 열기 전 대상 브랜치의 최신 원격 커밋을 받아 작업 브랜치에 rebase하고, 충돌을
  해결한 뒤 관련 기능을 다시 확인합니다.
- 자신의 작업 브랜치에서만, 리뷰 전 커밋의 목적을 정리하기 위해 interactive rebase를
  사용할 수 있습니다. rebase 뒤에는 diff를 self-review하고 lint·type-check·테스트를
  다시 실행합니다.
- rebase로 작업 브랜치의 이력이 바뀌어 push가 필요하면 `--force-with-lease`만 사용합니다.
  영구 브랜치에는 force push하지 않습니다.
- PR은 작성자를 제외한 최소 두 명의 승인을 받은 뒤 병합합니다.
  - 작성자가 GitHub의 `Create a merge commit`을 선택해 병합합니다.
  - 병합된 작업 브랜치는 삭제합니다.

## 배포와 긴급 수정

```text
작업 브랜치 → dev → release → main
                Preview  Production  배포 완료 기준선
```

`dev`에서 통합 QA와 Preview 확인을 마친 변경만 `release`로 승격합니다. Production에서
핵심 흐름을 확인한 뒤 동일한 내용을 `main`에 반영합니다.

운영 장애는 `release`에서 `hotfix/*`를 분기합니다. `release`에 병합해 배포를 확인하고,
같은 수정은 반드시 `main`과 `dev`에도 반영합니다. 마지막 정상 배포의 재배포 또는 hotfix
PR로 롤백하며, 원인·사용자 영향·복구 결과를 PR에 기록합니다.

출시 버전은 실제 Production 배포가 확인된 `release` 커밋에 annotated tag
(`v1.0.0` 형식)를 만들고 GitHub Release에 기록합니다. 버전은 Semantic Versioning을
따릅니다.

---

작성일시: 2026-09-16  
최종 편집일시: 2026-09-16
