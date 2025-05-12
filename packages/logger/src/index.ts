export const detectEnvironment = (): "node" | "browser" | "unknown" => {
  if (typeof window !== "undefined" && typeof window.document !== "undefined") {
    return "browser"; // 브라우저 환경
  } else if (
    typeof process !== "undefined" &&
    process.versions != null &&
    process.versions.node != null
  ) {
    return "node"; // Node.js 환경
  }
  return "unknown"; // 알 수 없는 환경
};

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

// Node.js 환경에서 사용할 ANSI 색상 코드
const nodeColors = {
  [LogLevel.INFO]: "\x1b[32m", // 초록색
  [LogLevel.WARN]: "\x1b[33m", // 노란색
  [LogLevel.ERROR]: "\x1b[31m", // 빨간색
  RESET: "\x1b[0m", // 색상 초기화
};

// 브라우저 환경에서 사용할 CSS 스타일
const browserStyles = {
  [LogLevel.INFO]: "color: green",
  [LogLevel.WARN]: "color: orange",
  [LogLevel.ERROR]: "color: red",
};

// 환경 감지
const environment = detectEnvironment();

export const log = (str: any, level: LogLevel = LogLevel.INFO) => {
  const timestamp = new Date().toISOString(); // 현재 타임스탬프

  if (environment === "node") {
    // Node.js 환경: ANSI 색상 코드 사용
    const color = nodeColors[level] || nodeColors.RESET;
    console.log(
      `${color}[${timestamp}] [${level}] logger: ${str}${nodeColors.RESET}`,
    );
  } else if (environment === "browser") {
    // 브라우저 환경: CSS 스타일 사용
    const style = browserStyles[level] || "";
    console.log(`%c[${timestamp}] [${level}] logger: ${str}`, style);
  } else {
    // 알 수 없는 환경: 기본 출력
    console.log(`[${timestamp}] [${level}] logger: ${str}`);
  }
};
