import MemberLogin from "./member-tab";

/**
 * 로그인 경로는 구글 하나다.
 *
 * 멘토도 부원이므로 같은 계정으로 들어온다. 멘토 권한은 계정 종류가 아니라
 * "이 스터디의 멘토인가"라는 관계에서 나오므로, 로그인 후 본인이 개설한
 * 스터디가 있으면 마이페이지에 관리 탭이 열린다.
 */
export function SignInTab() {
  return <MemberLogin />;
}
