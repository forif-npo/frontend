"use client";

import { autoHyphenPhoneNumber } from "@/utils/form";
import { signUpSchema, SignUpValues } from "@core/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button } from "@ui/components/client";
import { TextInput } from "@ui/components/server";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("SignUpPage.form");
  const initialValues: SignUpValues = {
    id: "",
    department: "",
    email: email,
    name: "",
    phoneNumber: "",
    referralSource: "",
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
          id="email"
          length="full"
          title={t("email.title")}
          description={t("email.description")}
          error={errors.email?.message ? t(errors.email?.message) : undefined}
          {...register("email")}
          value={email}
          readOnly
        />
        <TextInput
          length="full"
          title={t("id.title")}
          description={t("id.description")}
          id="id"
          placeholder={t("id.placeholder")}
          error={errors.id?.message ? t(errors.id?.message) : undefined}
          disabled={isPending}
          {...register("id")}
        />
        <TextInput
          length="full"
          title={t("name.title")}
          id="name"
          placeholder={t("name.placeholder")}
          error={errors.name?.message ? t(errors.name?.message) : undefined}
          disabled={isPending}
          {...register("name")}
        />
        <TextInput
          length="full"
          title={t("department.title")}
          id="department"
          placeholder={t("department.placeholder")}
          error={
            errors.department?.message
              ? t(errors.department?.message)
              : undefined
          }
          disabled={isPending}
          {...register("department")}
        />
        <TextInput
          length="full"
          title={t("phoneNumber.title")}
          id="phoneNumber"
          placeholder={t("phoneNumber.placeholder")}
          error={
            errors.phoneNumber?.message
              ? t(errors.phoneNumber?.message)
              : undefined
          }
          disabled={isPending}
          {...register("phoneNumber", {
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
