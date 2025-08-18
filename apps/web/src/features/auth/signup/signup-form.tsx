"use client";

import {
  departmentsOptions,
  referralSourcesOptions,
} from "@/constants/options.constant";
import { autoHyphenPhoneNumber } from "@/utils/form";
import { signUpSchema, SignUpValues } from "@core/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button, Checkbox, SelectBox } from "@ui/components/client";
import { Label, Link, TextInput } from "@ui/components/server";
import Form from "next/form";
import { useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: SignUpValues;
};

interface SignUpFormProps {
  action: (
    initialState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  email: string;
}

export function SignUpForm({ action, email }: SignUpFormProps) {
  const initialValues: SignUpValues = {
    email: email,
    id: "",
    department: "",
    name: "",
    phoneNumber: "",
    referralSource: "",
    serviceTermAgree: false,
    privacyPolicyAgree: false,
  };

  const [state, formAction, isPending] = useActionState(action, {
    values: initialValues,
    errors: {},
  });
  const form = useForm<SignUpValues>({
    resolver: standardSchemaResolver(signUpSchema),
    values: state.values,
    errors: state.errors,
    mode: "onBlur",
  });
  const {
    control,
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const serviceTermAgree = watch("serviceTermAgree");
  const privacyPolicyAgree = watch("privacyPolicyAgree");

  useEffect(() => {
    for (const key in state.values) {
      form.setValue(
        key as keyof SignUpValues,
        state.values[key as keyof SignUpValues],
      );
    }
    form.clearErrors();

    if (state.errors) {
      Object.keys(state.errors).forEach((key) => {
        form.setError(key as keyof SignUpValues, {
          message: state.errors[key]?.message ?? "",
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="border-divider-gray-light rounded-3 mb-16 flex flex-col justify-center border p-8">
      <Form action={formAction} className="flex flex-col justify-center gap-10">
        <TextInput
          autoComplete="email"
          id="email"
          length="full"
          title="이메일"
          description="포리프 부원으로 가입을 원할 시 이메일 주소가 'hanyang.ac.kr'인지 꼭 확인해주세요"
          error={errors.email?.message ? errors.email?.message : undefined}
          {...register("email")}
          value={email}
          readOnly
        />
        <TextInput
          length="full"
          title="학번"
          description="학번은 입학년도로 시작하는 10자리로 구성되어 있습니다."
          id="id"
          placeholder="2023063845"
          error={errors.id?.message}
          disabled={isPending}
          {...register("id")}
        />
        <TextInput
          autoComplete="name"
          length="full"
          title="이름"
          id="name"
          placeholder="홍길동"
          error={errors.name?.message}
          disabled={isPending}
          {...register("name")}
        />
        <Controller
          control={control}
          name="department"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <>
              <SelectBox
                id="department"
                value={value || null}
                options={departmentsOptions}
                placeholder="정보시스템학과"
                title="학과"
                onChange={onChange}
                error={errors.department?.message}
                disabled={isPending}
              />
              {/* Hidden input for FormData */}
              <input type="hidden" name="department" value={value || ""} />
            </>
          )}
        />

        <TextInput
          length="full"
          title="전화번호"
          id="phoneNumber"
          description="카카오톡 메세지로 ... 하기 위해 사용됩니다."
          placeholder="010-1234-5678"
          error={errors.phoneNumber?.message}
          disabled={isPending}
          {...register("phoneNumber", {
            onChange: (e) => {
              autoHyphenPhoneNumber(e, setValue);
            },
          })}
        />
        <Controller
          control={control}
          name="referralSource"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <>
              <SelectBox
                id="referralSource"
                value={value || null}
                options={referralSourcesOptions}
                placeholder="동아리 박람회"
                title="추천 경로"
                onChange={onChange}
                error={errors.referralSource?.message}
                disabled={isPending}
              />
              {/* Hidden input for FormData */}
              <input type="hidden" name="referralSource" value={value || ""} />
            </>
          )}
        />
        <section className="flex flex-col gap-1">
          <Label weight="bold" className="text-text-basic">
            아래 이용약관에 동의해주세요.
          </Label>
          <div className="border-border-gray-light rounded-2 flex flex-col gap-4 border p-8">
            <Checkbox
              id="agree-all-checkbox"
              size="md"
              label="모두 동의합니다."
              defaultChecked={privacyPolicyAgree && serviceTermAgree}
              onChange={(next) => {
                setValue("privacyPolicyAgree", next);
                setValue("serviceTermAgree", next);
              }}
            />
            <div className="flex flex-row items-center">
              <div className="flex-1">
                <Checkbox
                  id="service-term-checkbox"
                  name="serviceTermAgree"
                  size="md"
                  label="[필수] 서비스 이용약관에 동의합니다."
                  defaultChecked={serviceTermAgree}
                  onChange={(next) => setValue("serviceTermAgree", next)}
                />
              </div>
              <Link
                href="/terms#TERMS"
                target="_blank"
                className="text-text-basic"
              >
                보기
              </Link>
            </div>
            <div className="flex flex-row items-center">
              <div className="flex-1">
                <Checkbox
                  id="privacy-policy-checkbox"
                  name="privacyPolicyAgree"
                  size="md"
                  label="[필수] 개인정보의 수집에 동의합니다."
                  defaultChecked={privacyPolicyAgree}
                  onChange={(next) => setValue("privacyPolicyAgree", next)}
                />
              </div>
              <Link
                href="/terms#PRIVACY_POLICY"
                target="_blank"
                className="text-text-basic"
              >
                보기
              </Link>
            </div>
          </div>
          <Label id="terms" size={"s"} className="text-text-danger">
            {errors.serviceTermAgree?.message}
          </Label>
        </section>
        <Label id="root" size={"s"} className="text-text-danger">
          {errors.root?.message}
        </Label>
        <Button type="submit" size="large" disabled={isPending}>
          회원가입
        </Button>
      </Form>
    </div>
  );
}
