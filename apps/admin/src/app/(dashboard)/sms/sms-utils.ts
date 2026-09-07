import { formatPhoneNumber } from "@core/utils/phone-number";
import type { AlimTalkTemplate, Receiver } from "./types";

const AUTO_FILLED_VARIABLES = new Set(["#{이름}"]);
const PHONE_NUMBER_IN_RECEIVER_LINE_REGEX =
  /01[016789][\s-]?\d{3,4}[\s-]?\d{4}/;

const VARIABLE_LABELS: Record<string, string> = {
  "#{스터디명}": "스터디명",
  "#{응답일정}": "응답 기한",
  "#{일시}": "일시",
  "#{장소}": "장소",
  "#{url}": "URL",
};

export function formatPhoneNumberLines(value: string) {
  return value
    .split("\n")
    .map((line) => {
      const phoneNumber = line.match(PHONE_NUMBER_IN_RECEIVER_LINE_REGEX)?.[0];
      if (!phoneNumber) return formatPhoneNumber(line.trim());

      return line.replace(phoneNumber, formatPhoneNumber(phoneNumber));
    })
    .join("\n");
}

export function formatReceiverLine(receiver: Receiver) {
  return `${receiver.name}, ${formatPhoneNumber(receiver.phoneNumber)}, ${receiver.department}`;
}

export function getVariableLabel(variable: string) {
  return VARIABLE_LABELS[variable] ?? variable;
}

export function getTemplateVariables(template: AlimTalkTemplate | undefined) {
  if (!template) return [];

  const contentVariables = template.content.match(/#\{[^}]+\}/g) ?? [];
  const buttonVariables = template.buttonLinks.flatMap(
    (link) => link.match(/#\{[^}]+\}/g) ?? [],
  );
  return Array.from(
    new Set([...template.variables, ...contentVariables, ...buttonVariables]),
  );
}

export function getRequiredTemplateVariables(templateVariables: string[]) {
  return templateVariables.filter(
    (variable) => !AUTO_FILLED_VARIABLES.has(variable),
  );
}

export function getMissingTemplateVariables(
  requiredVariables: string[],
  values: Record<string, string | undefined>,
) {
  return requiredVariables.filter((variable) => !values[variable]?.trim());
}

export function buildAlimTalkVariables(
  requiredVariables: string[],
  values: Record<string, string | undefined>,
) {
  return Object.fromEntries(
    requiredVariables.map((variable) => [
      variable,
      values[variable]?.trim() ?? "",
    ]),
  );
}
