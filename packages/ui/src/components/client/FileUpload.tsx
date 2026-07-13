"use client";
import React, { useEffect, useRef, useState } from "react";
import { LoaderCircle, Upload, X } from "@repo/assets/icons/lucide";
import { Label } from "../server/Label";

interface FileObject {
  file: File;
  name: string;
  size: number;
  status: "uploading" | "success" | "error";
}

function FileThumbnail({ file }: { file: File }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!previewUrl) return null;

  return (
    <img
      src={previewUrl}
      alt=""
      className="h-10 w-10 shrink-0 rounded border border-[#cdd1d5] object-cover"
    />
  );
}

interface FileUploadComponentProps {
  title?: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  files?: File[];
  onUpload: (file: File) => Promise<boolean>;
  onRemove: (fileName: string) => void;
  className?: string;
}

export const FileUpload: React.FC<FileUploadComponentProps> = ({
  title,
  description,
  accept,
  multiple = true,
  maxFiles = 3,
  files: controlledFiles,
  onUpload,
  onRemove,
  className = "",
}) => {
  const [internalFiles, setInternalFiles] = useState<FileObject[]>([]);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledFiles !== undefined;
  const files = isControlled
    ? controlledFiles.map((file) => ({
        file,
        name: file.name,
        size: file.size,
        status: "success" as const,
      }))
    : internalFiles;
  const isFull = files.length >= maxFiles;
  const shouldShowDropZone = !isFull;
  const shouldShowCount = maxFiles > 1;
  const shouldShowFileList = shouldShowCount || files.length > 0;

  const handleFiles = async (newFiles: FileList) => {
    const remainingSlots = maxFiles - files.length;
    if (remainingSlots <= 0) {
      alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
      return;
    }

    const filesToAdd = Array.from(newFiles).slice(0, remainingSlots);
    const newFileObjects: FileObject[] = filesToAdd.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      status: "uploading",
    }));

    if (!isControlled) {
      setInternalFiles((prevFiles) => [...prevFiles, ...newFileObjects]);
    }

    for (const fileData of newFileObjects) {
      const success = await onUpload(fileData.file);
      if (!isControlled) {
        setInternalFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.name === fileData.name
              ? { ...f, status: success ? "success" : "error" }
              : f,
          ),
        );
      }
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === dropZoneRef.current) {
      setIsDragActive(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const { files } = e.dataTransfer;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      handleFiles(files);
    }
    e.target.value = "";
  };

  const removeFile = (fileName: string) => {
    if (!isControlled) {
      setInternalFiles((prevFiles) =>
        prevFiles.filter((file) => file.name !== fileName),
      );
    }
    onRemove(fileName);
  };

  return (
    <div
      className={`w-full rounded-lg border border-[#cdd1d5] bg-white p-4 ${className}`}
    >
      {title && <h2 className="mb-2 text-[17px] font-bold">{title}</h2>}
      {description && shouldShowDropZone && (
        <p className="mb-4 text-gray-600">{description}</p>
      )}

      {shouldShowDropZone && (
        <div
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-lg border border-dashed px-6 py-8 text-center transition-colors ${
            isDragActive
              ? "border-primary-80 bg-[#ecf2fe]"
              : "border-gray-30 hover:border-primary bg-white"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept={accept}
            multiple={multiple}
            className="hidden"
          />
          <Upload className="text-text-subtle mx-auto mb-2 h-6 w-6" />
          <Label size="s" className="text-gray-60 cursor-pointer">
            파일을 여기에 끌어다 놓거나, 클릭하여 파일을 선택하세요
          </Label>
        </div>
      )}

      {shouldShowFileList && (
        <div className="mt-4 flex flex-col gap-2">
          {shouldShowCount && (
            <p>
              <Label size={"s"} color={"primary"}>
                {files.length}개
              </Label>
              <Label size={"s"} color={"gray-60"}>
                {" "}
                / {maxFiles}개
              </Label>
            </p>
          )}
          {files.map((file, index) => (
            <div
              key={index}
              className="border-gray-30 rounded-4 flex items-center justify-between gap-2 border border-solid p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileThumbnail file={file.file} />
                <Label size="s" className="truncate">
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </Label>
              </div>
              {file.status === "uploading" && (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              )}
              {file.status === "success" && (
                <button type="button" onClick={() => removeFile(file.name)}>
                  <Label
                    className="flex cursor-pointer items-center text-red-500 hover:text-red-700"
                    size={"s"}
                  >
                    <X className="h-5 w-5" /> 삭제
                  </Label>
                </button>
              )}
              {file.status === "error" && (
                <button type="button" onClick={() => removeFile(file.name)}>
                  <Label
                    className="flex cursor-pointer items-center text-red-500 hover:text-red-700"
                    size={"s"}
                  >
                    <X className="h-5 w-5" /> 에러
                  </Label>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
