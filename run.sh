#!/bin/bash
set -e

# 총 시작 시간
TOTAL_START=$(date +%s)

run_step() {
  local name=$1
  shift
  echo "🔹 $name..."
  local start end output rc
  start=$(date +%s)
  # 명령어 실행 결과를 캡처
  if output=$("$@" 2>&1); then
    rc=0
  else
    rc=$?
  fi
  end=$(date +%s)

  if [ $rc -ne 0 ]; then
    # 실패 시 원래 출력 보여주고 종료
    echo "❌ $name failed:"
    echo "$output"
    exit $rc
  else
    # 성공 시에는 시간만
    echo "✔ $name took $((end-start))s"
  fi
}

# 타입체크
run_step "Type checking" pnpm type-check

# 테스트
run_step "Running tests" pnpm test

export COMPOSE_FILE="docker-compose.yml"

# 컨테이너 정리
run_step "Cleaning up orphan containers" docker compose -f "$COMPOSE_FILE" down --remove-orphans

# 컨테이너 시작
echo "🔹 Starting containers..."
bash -c 'COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose -f "$COMPOSE_FILE" up --build -d'

# 총 종료 시간
TOTAL_END=$(date +%s)
echo "⏱️  Total runtime: $((TOTAL_END-TOTAL_START))s"
