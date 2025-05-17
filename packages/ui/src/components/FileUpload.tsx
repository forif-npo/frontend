import React, { useRef, useState } from "react";
import { Label } from "./Label";

interface FileObject {
  file: File;
  name: string;
  size: number;
  status: "uploading" | "success" | "error";
}

const XIcon: React.FC = () => (
  <svg
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

interface FileUploadComponentProps {
  title: string;
  description?: string;
  maxFiles?: number;
  onUpload: (file: File) => Promise<boolean>;
  onRemove: (fileName: string) => void;
}

export const FileUpload: React.FC<FileUploadComponentProps> = ({
  title,
  description,
  maxFiles = 3,
  onUpload,
  onRemove,
}) => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

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

    setFiles((prevFiles) => [...prevFiles, ...newFileObjects]);

    for (const fileData of newFileObjects) {
      const success = await onUpload(fileData.file);
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.name === fileData.name
            ? { ...f, status: success ? "success" : "error" }
            : f,
        ),
      );
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
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName));
    onRemove(fileName);
  };

  // Custom SVG Icons
  const UploadIcon: React.FC = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-2 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  );

  const LoaderIcon: React.FC = () => (
    <svg
      className="mr-2 h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <div className="mx-auto w-full rounded-lg bg-white p-6">
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      {description && <p className="mb-4 text-gray-600">{description}</p>}

      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed px-10 py-12 text-center ${
          isDragActive
            ? "border-primary-80"
            : "border-gray-30 hover:border-primary"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          multiple
          className="hidden"
        />
        <UploadIcon />
        <Label size="s" className="text-gray-60 cursor-pointer">
          파일을 여기에 끌어다 놓거나, 클릭하여 파일을 선택하세요
        </Label>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <p>
          <Label size={"s"} color={"primary"}>
            {files.length}개
          </Label>
          <Label size={"s"} color={"gray-60"}>
            {" "}
            / {maxFiles}개
          </Label>
        </p>
        {files.map((file, index) => (
          <div
            key={index}
            className="border-gray-30 rounded-4 flex items-center justify-between gap-2 border border-solid p-4"
          >
            <div className="flex items-center">
              <Label size="s">
                {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </Label>
            </div>
            {file.status === "uploading" && <LoaderIcon />}
            {file.status === "success" && (
              <button onClick={() => removeFile(file.name)}>
                <Label
                  className="flex cursor-pointer items-center text-red-500 hover:text-red-700"
                  size={"s"}
                >
                  <XIcon /> 삭제
                </Label>
              </button>
            )}
            {file.status === "error" && (
              <button onClick={() => removeFile(file.name)}>
                <Label
                  className="flex cursor-pointer items-center text-red-500 hover:text-red-700"
                  size={"s"}
                >
                  <XIcon /> 에러
                </Label>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
