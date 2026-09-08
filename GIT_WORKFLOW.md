# Git 작업·배포 흐름

이 문서는 FORIF Frontend의 브랜치, PR, 배포 승격 기준을 관리합니다.

## 목적

작업 변경을 `dev`에서 통합하고, 검증된 변경을 `release`로 승격해 실제 서비스를
배포합니다. `main`은 실제 배포가 완료된 제품 기준선을 기록합니다.

1.0 이전의 배포도 이 흐름을 사용합니다. 버전 태그는 출시 버전이 확정된 배포에만
생성합니다.

## 브랜치

| 브랜치      | 역할                                            | 변경 유입                                 |
| ----------- | ----------------------------------------------- | ----------------------------------------- |
| `main`      | 실제 배포가 완료된 제품 기준선                  | `release` 승격 PR                         |
| `release`   | Vercel Production Branch, 실제 서비스 배포 대상 | `dev` 승격 PR, `hotfix/*` PR              |
| `dev`       | 기능 통합과 Preview 검증 기준선                 | 작업 브랜치 PR, `release` 동기화 PR       |
| 작업 브랜치 | 하나의 기능, 수정, 문서화 또는 구조 개선        | `dev` 또는 긴급 상황의 `release`에서 분기 |

영구 브랜치인 `main`, `release`, `dev`는 PR로만 변경합니다. 작업 브랜치는 병합 후
삭제합니다.

## 작업 브랜치와 PR 대상

| 접두사      | 분기 기준 | PR 대상   | 용도                           |
| ----------- | --------- | --------- | ------------------------------ |
| `feat/`     | `dev`     | `dev`     | 사용자 기능                    |
| `fix/`      | `dev`     | `dev`     | 일반 결함 수정                 |
| `refactor/` | `dev`     | `dev`     | 제품 계약을 유지하는 구조 개선 |
| `docs/`     | `dev`     | `dev`     | 문서와 개발 흐름               |
| `chore/`    | `dev`     | `dev`     | 개발 도구와 저장소 유지보수    |
| `hotfix/`   | `release` | `release` | 운영 서비스 긴급 수정          |

브랜치 이름은 `접두사/이슈-짧은-설명` 형식을 사용합니다. 이슈가 없는 작업은
`접두사/짧은-설명` 형식을 사용합니다.

예시: `feat/FOR-123-study-apply`, `fix/login-redirect`,
`refactor/admin-table-state`

## 승격 흐름

```text
feat/*, fix/*, refactor/*, docs/*, chore/*
                    │
                    ▼
                   dev ── PR CI · Vercel Preview · 통합 QA
                    │
                    ▼
                 release ── Vercel 실제 배포 · 운영 검증
                    │
                    ▼
                  main ── 배포 완료 제품 기준선
```

`dev`에서 `release`로 올리는 PR은 배포 후보의 변경 의도와 사용자 영향을 명확히
기록합니다. 실제 배포가 정상임을 확인한 뒤 같은 내용을 `main`에 반영합니다.

`release`에서 발생한 긴급 수정은 다음 순서로 반영합니다.

```text
hotfix/* → release → 실제 배포 확인 → main
                   └──────────────→ dev
```

`dev` 동기화 PR은 이후 배포 후보에 긴급 수정이 포함되도록 유지합니다.

## PR과 검증 게이트

모든 PR은 다음 정보를 포함합니다.

- 변경한 앱 또는 패키지 범위
- 사용자 동작, API 계약, 권한, 화면 출력에 미치는 영향
- 실행한 자동 검증과 수동 확인 방법
- 남은 위험과 후속 작업

PR CI는 `dev`, `release`, `main` 대상 PR에서 아래 검증을 실행합니다.

```bash
pnpm lint
pnpm type-check
pnpm test
```

`dev` PR은 Vercel Preview에서 주요 사용자 흐름을 확인합니다. `release` PR은 Preview
확인과 배포 체크리스트를 완료한 뒤 병합합니다. 실제 `release` 배포 후에는 Production
환경에서 핵심 사용자 흐름을 다시 확인합니다.

빌드 설정, 환경 변수, Next 설정, 공통 패키지를 변경한 PR은 `pnpm build` 결과도
확인합니다. Vercel 빌드는 Vercel의 Production 환경 변수로 검증합니다.

## 운영 설정 체크리스트

저장소 관리자는 전략 활성화 시 아래 설정을 적용합니다.

- `main`, `release`, `dev`의 direct push 차단
- 세 브랜치의 PR CI 성공 상태를 병합 필수 조건으로 등록
- `release`에 코드 리뷰 승인 조건 등록
- Vercel Production Branch를 `release`로 지정
- Vercel Preview와 Production 환경 변수 범위 확인
- 배포 알림과 Vercel 배포 상태를 `release` PR에서 확인

현재 실제 배포 기준이 `main`인 경우, 현재 `main` HEAD에서 `release`와 `dev`를 만든
뒤 Vercel Production Branch를 `release`로 전환합니다. 코드 차이 없는 첫 배포 결과를
확인한 후 이 흐름을 사용합니다.

## 롤백과 버전 기록

운영 장애는 마지막 정상 `release` 배포를 Vercel에서 재배포하거나, 문제 변경을 되돌리는
`hotfix/*` PR로 처리합니다. 원인, 사용자 영향, 복구 결과는 해당 PR에 기록합니다.

`v1.0.0` 같은 버전 태그는 실제 출시가 완료된 `release` 배포를 기준으로 생성합니다.
태그 대상 커밋, 배포 시각, 주요 변경 사항은 릴리즈 노트에 기록합니다.
