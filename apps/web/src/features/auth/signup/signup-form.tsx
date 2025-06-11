"use client";

import {
  departmentsOptions,
  referralSourcesOptions,
} from "@/constants/options.constant";
import { autoHyphenPhoneNumber } from "@/utils/form";
import { signUpSchema, SignUpValues } from "@core/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button, SelectBox } from "@ui/components/client";
import { Checkbox, Label, Link, TextInput } from "@ui/components/server";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("SignUpPage.form");
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
          autoComplete="name"
          length="full"
          title={t("name.title")}
          id="name"
          placeholder={t("name.placeholder")}
          error={errors.name?.message ? t(errors.name?.message) : undefined}
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
                error={
                  errors.department?.message
                    ? t(errors.department?.message)
                    : undefined
                }
                disabled={isPending}
              />
              {/* Hidden input for FormData */}
              <input type="hidden" name="department" value={value || ""} />
            </>
          )}
        />

        <TextInput
          length="full"
          title={t("phoneNumber.title")}
          id="phoneNumber"
          description="카카오톡 메세지로 ... 하기 위해 사용됩니다."
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
                error={
                  errors.referralSource?.message
                    ? t(errors.referralSource?.message)
                    : undefined
                }
                disabled={isPending}
              />
              {/* Hidden input for FormData */}
              <input type="hidden" name="referralSource" value={value || ""} />
            </>
          )}
        />
        <section className="flex flex-col gap-1">
          <Label weight="bold" className="text-text-basic">
            {t("terms.title")}
          </Label>
          <div className="border-border-gray-light rounded-2 flex flex-col gap-4 border p-8">
            <Checkbox
              id="agree-all-checkbox"
              size="md"
              label={t("terms.agreeAll")}
              status={privacyPolicyAgree && serviceTermAgree ? "on" : "off"}
              onChange={() => {
                setValue("privacyPolicyAgree", !privacyPolicyAgree);
                setValue("serviceTermAgree", !serviceTermAgree);
              }}
            />
            <div className="flex flex-row items-center">
              <div className="flex-1">
                <Checkbox
                  id="service-term-checkbox"
                  name="serviceTermAgree"
                  size="md"
                  label={t("terms.serviceLabel")}
                  status={serviceTermAgree ? "on" : "off"}
                  onChange={() =>
                    setValue("serviceTermAgree", !serviceTermAgree)
                  }
                />
              </div>
              <Link
                href="/terms#TERMS"
                target="_blank"
                className="text-text-basic"
              >
                {t("terms.show")}
              </Link>
            </div>
            <div className="flex flex-row items-center">
              <div className="flex-1">
                <Checkbox
                  id="privacy-policy-checkbox"
                  name="privacyPolicyAgree"
                  size="md"
                  label={t("terms.privacyPolicyLabel")}
                  status={privacyPolicyAgree ? "on" : "off"}
                  onChange={() =>
                    setValue("privacyPolicyAgree", !privacyPolicyAgree)
                  }
                />
              </div>
              <Link
                href="/terms#PRIVACY_POLICY"
                target="_blank"
                className="text-text-basic"
              >
                {t("terms.show")}
              </Link>
            </div>
          </div>
          <Label id="terms" size={"s"} className="text-text-danger">
            {errors.serviceTermAgree?.message
              ? t(errors.serviceTermAgree?.message)
              : null}
          </Label>
        </section>
        <Label id="root" size={"s"} className="text-text-danger">
          {errors.root?.message ? t(errors.root?.message) : null}
        </Label>
        <Button type="submit" size="large" disabled={isPending}>
          {t("signupButtonText")}
        </Button>
      </Form>
    </div>
  );
}
