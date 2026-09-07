type ThumbnailFile = Pick<File, "size" | "type">;

export function getThumbnailValidationMessage(file: ThumbnailFile) {
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    return "jpg, jpeg, png 형식의 이미지만 업로드할 수 있습니다.";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "이미지 파일은 최대 5MB까지 업로드할 수 있습니다.";
  }

  return null;
}
