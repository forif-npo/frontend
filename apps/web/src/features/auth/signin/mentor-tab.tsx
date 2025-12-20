"use client";
import { mentorSignIn } from "@/features/auth/signin/actions";
import { mentorSignInSchema, MentorSignInValues } from "@core/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button, TextInput } from "@ui/components/client";
import { InfoText, Label } from "@ui/components/server";
import Form from "next/form";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function MentorLogin() {
  const initialValues: MentorSignInValues = {
    studentId: "",
    password: "",
  };

  const [state, formAction, isPending] = useActionState(mentorSignIn, {
    values: initialValues,
    errors: {},
  });

  const form = useForm<MentorSignInValues>({
    resolver: standardSchemaResolver(mentorSignInSchema),
    values: state.values,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const {
    register,
    formState: { errors },
    clearErrors,
    setError,
    setValue,
  } = form;

  useEffect(() => {
    for (const key in state.values) {
      setValue(
        key as keyof MentorSignInValues,
        state.values[key as keyof MentorSignInValues],
      );
    }

    clearErrors();

    if (state.errors && Object.keys(state.errors).length > 0) {
      Object.entries(state.errors).forEach(([key, error]) => {
        const errorObj = error as { message: string };
        if (errorObj?.message) {
          setError(key as keyof MentorSignInValues, {
            message: errorObj.message,
          });
        }
      });
    }
  }, [state, setValue, clearErrors, setError]);

  return (
    <div className="mt-10 flex flex-col gap-6">
      <div className="border-divider-gray-light rounded-3 flex flex-col gap-6 border px-10 py-8 shadow">
        <Form
          action={formAction}
          className="flex flex-col justify-center gap-6"
        >
          <TextInput
            id="studentId"
            length="full"
            title="학번"
            placeholder="2023063845"
            error={errors.studentId?.message}
            disabled={isPending}
            {...register("studentId")}
          />
          <TextInput
            id="password"
            type="password"
            length="full"
            title="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            error={errors.password?.message}
            disabled={isPending}
            {...register("password")}
          />
          <Label id="root" size={"s"} className="text-text-danger">
            {errors.root?.message}
          </Label>
          <Button type="submit" size="large" disabled={isPending}>
            {isPending ? "로그인 중..." : "로그인"}
          </Button>
        </Form>
        <InfoText>
          알림톡을 통해 전달된 아이디와 비밀번호를 사용해주세요. 아이디 또는
          비밀번호를 찾을 수 없다면 운영진에게 문의해주세요.
        </InfoText>
      </div>
    </div>
  );
}
