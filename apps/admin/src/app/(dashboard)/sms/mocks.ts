import type { Receiver } from "./types";

const MOCK_RECEIVERS: Receiver[] = [
  { name: "김민수", phoneNumber: "01012345678", studentId: "2023012345" },
  { name: "이서연", phoneNumber: "01087654321", studentId: "2023054321" },
  { name: "박지훈", phoneNumber: "01098765432", studentId: "2022034567" },
  { name: "최수민", phoneNumber: "01011112222", studentId: "2024011234" },
  { name: "정다은", phoneNumber: "01033334444", studentId: "2023067890" },
  { name: "한승우", phoneNumber: "01055556666", studentId: "2022098765" },
  { name: "윤하영", phoneNumber: "01077778888", studentId: "2024023456" },
  { name: "오준혁", phoneNumber: "01099990000", studentId: "2023045678" },
  { name: "강예진", phoneNumber: "01022223333", studentId: "2022056789" },
  { name: "임도현", phoneNumber: "01044445555", studentId: "2024034567" },
];

export async function getReceivers(): Promise<Receiver[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_RECEIVERS;
}
