"use client";

import { autoHyphenPhoneNumber } from "@/utils/form";
import { signUpSchema, SignUpValues } from "@core/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button } from "@ui/components/client";
import { TextInput } from "@ui/components/server";
import Form from "next/form";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

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
    id: "",
    department: "",
    email: email,
    name: "",
    phone_number: "",
    referral_source: "",
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
    register,
    formState: { errors },
    setValue,
  } = form;

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
          length="full"
          title="이메일"
          description="포리프 부원으로 가입을 원할 시 이메일 주소가 'hanyang.ac.kr'인지 꼭 확인해주세요"
          id="email"
          error={errors.email?.message}
          {...register("email")}
          value={email}
          readOnly
        />
        <TextInput
          length="full"
          title="학번"
          description="입학년도로 시작하는 10자리로 구성되어 있습니다."
          id="id"
          placeholder="2023063845"
          error={errors.id?.message}
          disabled={isPending}
          {...register("id")}
        />
        <TextInput
          length="full"
          title="이름"
          id="name"
          placeholder="홍길동"
          error={errors.name?.message}
          disabled={isPending}
          {...register("name")}
        />
        <TextInput
          length="full"
          title="학과"
          id="department"
          placeholder="정보시스템학과"
          error={errors.department?.message}
          disabled={isPending}
          {...register("department")}
        />
        <TextInput
          length="full"
          title="전화번호"
          id="phone_number"
          placeholder="010-1234-5678"
          error={errors.phone_number?.message}
          disabled={isPending}
          {...register("phone_number", {
            onChange: (e) => {
              autoHyphenPhoneNumber(e, setValue);
            },
          })}
        />
        <Button type="submit" size="large" disabled={isPending}>
          회원가입
        </Button>
      </Form>
    </div>
  );
}
