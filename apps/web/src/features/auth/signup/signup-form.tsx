"use client";

import { signUpSchema } from "@core/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectBox } from "@ui/components/client";
import { TextInput } from "@ui/components/server";
import Form from "next/form";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: z.infer<typeof signUpSchema>;
};

export function SignUpForm({
  action,
  values,
}: {
  action: (
    initialState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  values: z.infer<typeof signUpSchema>;
}) {
  const [state, formAction, isPending] = useActionState(action, {
    values,
    errors: {},
  });
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    errors: state.errors,
    values: state.values,
    mode: "onTouched",
  });
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <div className="border-divider-gray-light rounded-3 mb-16 flex flex-col justify-center border p-8">
      <Form action={formAction} className="flex flex-col justify-center gap-10">
        <TextInput
          length="full"
          title="이메일"
          description="포리프 부원으로 가입을 원할 시 이메일 주소가 'hanyang.ac.kr'인지 꼭 확인해주세요"
          id="email"
          placeholder="standardstar@hanyang.ac.kr"
          error={errors.email?.message}
          {...register("email")}
          disabled
        />
        <TextInput
          length="full"
          title="학번"
          description="입학년도로 시작하는 10자리로 구성되어 있습니다."
          id="id"
          placeholder="2023063845"
          error={errors.id?.message}
          {...register("id")}
        />
        <TextInput
          length="full"
          title="이름"
          id="name"
          placeholder="홍길동"
          error={errors.name?.message}
          {...register("name")}
        />
        <SelectBox
          id="department"
          placeholder="정보시스템학과"
          title="학과"
          description="한양대학교 서울캠퍼스의 대학/학과 소개를 바탕으로 만들었습니다."
          options={[
            {
              label: "정보시스템학과",
              value: "정보시스템학과",
            },
          ]}
          error={errors.department?.message}
          {...register("department")}
        />
        <TextInput
          length="full"
          title="전화번호"
          id="phoneNumber"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />
        <Button type="submit" size="large" disabled={isPending}>
          회원가입
        </Button>
      </Form>
    </div>
  );
}
