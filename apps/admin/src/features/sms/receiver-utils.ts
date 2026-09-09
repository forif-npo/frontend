const PHONE_NUMBER_IN_RECEIVER_LINE_REGEX =
  /01[016789][\s-]?\d{3,4}[\s-]?\d{4}/;

export function extractPhoneNumber(value: string) {
  const phoneNumber = value.match(PHONE_NUMBER_IN_RECEIVER_LINE_REGEX)?.[0];
  return (phoneNumber ?? value).replace(/\D/g, "");
}

export function getUniqueReceiverPhoneNumbers(receiversText: string) {
  return Array.from(
    new Set(receiversText.split("\n").map(extractPhoneNumber).filter(Boolean)),
  );
}
