"use client";

import { FileUpload, SelectBox, TextInput } from "@ui/components/client";
import { CircleMinus, CirclePlus } from "@repo/assets/icons/lucide";
import type { StudyOpenValues } from "@core/schemas";
import { Controller, type UseFormReturn } from "react-hook-form";
import { REFERENCE_TYPE_OPTIONS } from "../constants";

const REFERENCE_FILE_MAX_SIZE_MB = 50;
const REFERENCE_FILE_MAX_SIZE_BYTES = REFERENCE_FILE_MAX_SIZE_MB * 1024 * 1024;

interface ReferenceFieldsProps {
  form: UseFormReturn<StudyOpenValues>;
}

type ReferenceValue = StudyOpenValues["references"][number]["value"];
type ReferenceFieldError = {
  type?: { message?: string };
  value?: { message?: string };
};

function isFileValue(value: ReferenceValue): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function getReferenceErrors(
  errors: UseFormReturn<StudyOpenValues>["formState"]["errors"],
) {
  return Array.isArray(errors.references)
    ? (errors.references as ReferenceFieldError[])
    : [];
}

export function ReferenceFields({ form }: ReferenceFieldsProps) {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const references = watch("references") || [];
  const referenceErrors = getReferenceErrors(errors);

  const addReference = () => {
    setValue("references", [...references, { type: "LINK", value: "" }], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeReference = (index: number) => {
    setValue(
      "references",
      references.filter((_, i) => i !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const changeReferenceType = (index: number, type: string) => {
    setValue(`references.${index}.type`, type, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`references.${index}.value`, type === "DOWNLOAD" ? null : "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const uploadReferenceFile = async (index: number, file: File) => {
    if (file.size > REFERENCE_FILE_MAX_SIZE_BYTES) {
      alert(
        `자료 파일은 최대 ${REFERENCE_FILE_MAX_SIZE_MB}MB까지 업로드할 수 있습니다.`,
      );
      return false;
    }

    setValue(`references.${index}.value`, file, {
      shouldDirty: true,
      shouldValidate: true,
    });

    return true;
  };

  const removeReferenceFile = (index: number) => {
    setValue(`references.${index}.value`, null, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
          참고자료
        </h3>
        <button
          type="button"
          onClick={addReference}
          className="text-text-primary flex h-6 w-6 items-center justify-center"
          aria-label="참고자료 추가"
          title="참고자료 추가"
        >
          <CirclePlus className="h-4 w-4" />
        </button>
      </div>

      {references.length > 0 && (
        <div className="flex flex-col gap-4">
          {references.map((reference, index) => {
            const valueError = referenceErrors[index]?.value?.message;

            return (
              <div key={index} className="flex items-start gap-3">
                <div className="-mt-2 w-[128px] shrink-0">
                  <Controller
                    control={control}
                    name={`references.${index}.type`}
                    render={({ field: { value } }) => (
                      <SelectBox
                        id={`references.${index}.type`}
                        value={value || null}
                        options={[...REFERENCE_TYPE_OPTIONS]}
                        placeholder="유형"
                        onChange={(type) => changeReferenceType(index, type)}
                        error={referenceErrors[index]?.type?.message}
                        size="md"
                      />
                    )}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  {reference.type === "DOWNLOAD" ? (
                    <>
                      <FileUpload
                        title="자료 파일 업로드"
                        description={`업로드할 자료 파일을 선택해주세요. (최대 ${REFERENCE_FILE_MAX_SIZE_MB}MB)`}
                        multiple={false}
                        maxFiles={1}
                        files={
                          isFileValue(reference.value) ? [reference.value] : []
                        }
                        onUpload={(file) => uploadReferenceFile(index, file)}
                        onRemove={() => removeReferenceFile(index)}
                        className="p-3"
                      />
                      {valueError && (
                        <p className="text-text-danger mt-1 text-[14px]">
                          {valueError}
                        </p>
                      )}
                    </>
                  ) : (
                    <TextInput
                      id={`references.${index}.value`}
                      length="full"
                      placeholder="웹사이트 링크를 입력해주세요"
                      error={valueError}
                      {...register(`references.${index}.value`)}
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeReference(index)}
                  className="text-text-danger mt-2 flex h-6 w-6 shrink-0 items-center justify-center"
                  aria-label="참고자료 삭제"
                  title="참고자료 삭제"
                >
                  <CircleMinus className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
