# 🦊 FORIF Frontend

한양대학교 중앙 개발 동아리 **FORIF**의 프론트엔드 모노레포입니다.

## 🚀 Quick Start

### 1. 레포지토리 클론

```bash
# 클론 전 권한을 가지고 있는지 확인해주세요.
git clone https://<YOUR_GIT_ACCOUNT>@github.com/forif-npo/frontend.git
cd frontend
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

Check http://localhost:3000

## 📦 프로젝트 구조

### 앱

- `web`: Next.js 기반 부원/멘토용 홈페이지
- `operator`: 운영진용 관리 시스템

### 패키지

- `@repo/ui`: 공통 React 컴포넌트 라이브러리
- `@repo/core`: 스키마, 유틸리티, 공통 환경 변수
- `@repo/assets`: 폰트, 아이콘, 이미지 등 정적 리소스
- `@repo/eslint-config`: ESLint 설정 프리셋
- `@repo/typescript-config`: TypeScript 설정
- `@repo/tailwind-config`: Tailwind CSS 설정
- `@repo/jest-presets`: Jest 테스트 설정

## 🛠️ 사용 가능한 스크립트

```bash
# 개발 모드로 모든 앱 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 린트 검사
pnpm lint

# 린트 자동 수정
pnpm lint:fix

# 타입 검사
pnpm type-check

# 테스트 실행
pnpm test

# 코드 포맷팅
pnpm format

# Storybook 실행
pnpm storybook

# Storybook 빌드
pnpm build-storybook
```

## 🐳 Docker로 실행하기

Docker와 Docker Compose를 사용하여 애플리케이션을 실행할 수 있습니다:

```bash
# 의존성 설치
pnpm install

# Docker 네트워크 생성
docker network create app_network

# 컨테이너 빌드 및 실행
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml up -d --build
```

http://localhost:3000 에서 애플리케이션을 확인하세요.

```bash
# 컨테이너 종료
docker compose -f docker-compose.yml down
```

## 🔧 개발 도구

이 프로젝트는 다음과 같은 개발 도구들이 설정되어 있습니다:

- [TypeScript](https://www.typescriptlang.org/) - 정적 타입 검사
- [ESLint](https://eslint.org/) - 코드 린팅
- [Prettier](https://prettier.io) - 코드 포맷팅
- [Jest](https://jestjs.io) - JavaScript 테스트 러너
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크
- [Storybook](https://storybook.js.org/) - 컴포넌트 개발 환경
- [Husky](https://typicode.github.io/husky/) - Git hooks
- [Commitlint](https://commitlint.js.org/) - 커밋 메시지 린팅

## 📝 커밋 규칙

이 프로젝트는 Conventional Commits를 따릅니다. 커밋 시 다음 명령어를 사용하세요:

```bash
pnpm commit
```

## 🤝 기여하기

FORIF 부원 및 기여자들을 위한 가이드입니다:

### 개발 참여

1. 이 레포지토리를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feat/amazing-feature`)
3. 변경사항을 커밋합니다 (`pnpm commit`)
4. 브랜치에 푸시합니다 (`git push origin feat/amazing-feature`)
5. Pull Request를 생성합니다

### 코드 리뷰

- 모든 PR은 최소 1명 이상의 리뷰어 승인이 필요합니다
- 코드 스타일과 컨벤션을 준수해주세요
- 테스트 코드 작성을 권장합니다

### 문의사항

- **개발 관련**: GitHub Issues 또는 FORIF 개발팀에 문의
- **동아리 관련**: [FORIF 공식 홈페이지](https://forif.org) 참고

---

**Made with ❤️ by FORIF**
