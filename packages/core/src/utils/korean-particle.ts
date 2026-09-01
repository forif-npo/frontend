/** 단어 뒤에 붙일 목적격 조사(을/를)를 반환한다. */
export function getObjectParticle(value: string): "을" | "를" {
  const lastChar = value.trim().at(-1);
  if (!lastChar) return "을";

  const charCode = lastChar.charCodeAt(0);
  const isHangulSyllable = charCode >= 0xac00 && charCode <= 0xd7a3;

  if (!isHangulSyllable) return "을";

  return (charCode - 0xac00) % 28 === 0 ? "를" : "을";
}
