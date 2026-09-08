# `@repo/big-calendar`

FORIF admin에서 사용하는 공통 캘린더 기능 패키지입니다.

## 제공 기능

- `CalendarProvider`: 이벤트·참석자·선택 상태를 제공하는 context
- `Calendar`: 현재 선택된 view를 렌더링하는 기본 컨테이너
- day, week, month, year, agenda view와 header·dialog·drag-and-drop primitive
- 이벤트·참석자 타입, 스키마, 변환 helper, mutation hook

공개 API의 전체 목록은 [`src/index.ts`](src/index.ts)를 기준으로 확인합니다.

## 사용

소비 앱은 workspace 의존성으로 `CalendarProvider`와 `Calendar`를 사용합니다.
이벤트 생성·수정·삭제 API 호출과 서버 데이터 재검증은 소비 앱에서 관리합니다.

```tsx
import {
  Calendar,
  CalendarProvider,
  type IAttendee,
  type IEvent,
} from "@repo/big-calendar";

export function CalendarSection({
  events,
  users,
}: {
  events: IEvent[];
  users: IAttendee[];
}) {
  return (
    <CalendarProvider events={events} users={users} defaultView="month">
      <Calendar />
    </CalendarProvider>
  );
}
```

필요한 캘린더 스타일은 소비 앱에서 한 번 불러옵니다.

```ts
import "@repo/big-calendar/styles.css";
```

## 개발과 검증

저장소 루트에서 실행합니다.

```bash
pnpm --filter @repo/big-calendar lint
pnpm --filter @repo/big-calendar type-check
pnpm --filter @repo/big-calendar test
```

캘린더 UI는 [REFACTORING.md](../../REFACTORING.md)의 디자인 시스템 규칙을 따릅니다.
색상에는 component variant와 semantic token을 사용합니다.
