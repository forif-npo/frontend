# 3단계 PR 초안

## 제목

```text
feat: 운영진 지원서 제출 및 조회 화면 연결
```

## 본문

```markdown
## 결과

운영진 지원서의 로그인 복귀, 동적 작성·즉시 제출, 본인 상세와 회장단 목록·상세를 backend `d657458` 계약에 연결했습니다.

## 주요 변경

- web 지원서: 1·2지망, 서버 문항, 필수/글자 수 검증, 제출 중 잠금, 오류별 안내
- web 인증: 외부 redirect를 차단하는 안전한 내부 callback URL
- web 내역: 회차별 본인 제출 snapshot 상세
- admin: 회차·부서·이름 서버 필터, offset 페이지네이션, 최소 목록과 PII 상세 dialog
- core: 지원 요청/응답 공유 타입
- docs: 실제 stage 3 계약, 검증 결과와 다음 작업자 handoff

## 검증

- web: type-check, 46 suites/164 tests 통과
- admin: type-check, 56 suites/171 tests 통과
- build: 양쪽 컴파일·타입·정적 페이지 생성 통과, Windows symlink 권한 때문에 standalone trace만 실패
- 실제 HTTP: 제출·중복·본인 조회·관리자 조회·마감·자격·긴 답변 검증 통과
- browser: 공개 화면, 로그인 복귀, admin 인증 경계, 390/768/1440px 검증 통과
- 인증된 사용자/운영진 화면의 최종 수동 클릭은 실제 계정 세션으로 별도 인수 확인

## 보안·범위

- 답변·연락처를 URL, client log, browser storage, 공개 cache에 저장하지 않음
- 즉시 제출만 지원하며 수정·취소·재지원·첨부는 범위 밖
- 관리자 목록은 연락처와 답변을 제외하고 상세 요청에서만 조회
```

복사용 초안이며 PR은 생성하지 않았다.
