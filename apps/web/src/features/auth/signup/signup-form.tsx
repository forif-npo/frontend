"use client";
import { TermsButton } from "@/components/terms-modal";
import { departmentsOptions } from "@/constants/options.constant";
import { autoHyphenPhoneNumber } from "@/utils/form";
import { signUpSchema, SignUpValues } from "@core/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button, Checkbox, SelectBox, TextInput } from "@ui/components/client";
import { InfoText, Label, Link } from "@ui/components/server";
import Form from "next/form";
import { useRouter } from "next/navigation";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { SignUpConfirmationModal } from "./signup-confirmation-modal";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: SignUpValues;
  success?: boolean;
  accessToken?: string;
};

interface SignUpFormProps {
  action: (
    initialState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  email: string;
}

export function SignUpForm({ action, email }: SignUpFormProps) {
  const router = useRouter();
  const initialValues: SignUpValues = {
    email: email,
    id: "",
    department: "",
    name: "",
    phoneNumber: "",
    serviceTermAgree: false,
    privacyPolicyAgree: false,
  };

  const [state, formAction, isPending] = useActionState(action, {
    values: initialValues,
    errors: {},
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isTransitionPending, startTransition] = useTransition();
  const form = useForm<SignUpValues>({
    resolver: standardSchemaResolver(signUpSchema),
    values: state.values,
    errors: state.errors,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  const {
    control,
    register,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = form;

  const serviceTermAgree = watch("serviceTermAgree");
  const privacyPolicyAgree = watch("privacyPolicyAgree");
  const watchedValues = watch();
  const [checkboxKey, setCheckboxKey] = useState(0);

  const isLoading = isPending || isTransitionPending;

  useEffect(() => {}, [watchedValues]);

  // 회원가입 성공 시 리디렉션
  useEffect(() => {
    if (state.success) {
      // 완료 페이지로 이동
      router.push("/signup/complete");
    }
  }, [state.success, router]);

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
    // Force checkbox re-render when form state changes
    setCheckboxKey((prev) => prev + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleValidateAndShowModal = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      const firstErrorField = Object.keys(form.formState.errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.focus();
      }
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleConfirmSignUp = () => {
    setIsConfirmModalOpen(false);

    startTransition(() => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    });
  };

  return (
    <div className="border-divider-gray-light rounded-3 mb-10 flex flex-col justify-center border p-8">
      <Form
        ref={formRef}
        action={formAction}
        className="flex flex-col justify-center gap-6"
      >
        <TextInput
          autoComplete="email"
          id="email"
          length="full"
          title="이메일"
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
          disabled={isLoading}
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
                disabled={isLoading}
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
          placeholder="010-1234-5678"
          error={errors.phoneNumber?.message}
          disabled={isLoading}
          {...register("phoneNumber", {
            onChange: (e) => {
              autoHyphenPhoneNumber(e, setValue);
            },
          })}
        />

        <section className="flex flex-col gap-1">
          <Label className="text-text-basic">약관 동의</Label>
          <div className="border-border-gray-light rounded-2 flex flex-col gap-4 border p-8">
            <Checkbox
              key={`all-agree-${checkboxKey}-${privacyPolicyAgree && serviceTermAgree}`}
              id="agree-all-checkbox"
              size="md"
              label="아래 사항에 대해 모두 동의합니다."
              defaultChecked={privacyPolicyAgree && serviceTermAgree}
              onChange={async (next) => {
                setValue("privacyPolicyAgree", next);
                setValue("serviceTermAgree", next);
                await trigger(["privacyPolicyAgree", "serviceTermAgree"]);
              }}
            />
            <div className="flex flex-row items-center">
              <div className="flex-1">
                <Controller
                  control={control}
                  name="serviceTermAgree"
                  render={({ field: { value, onChange } }) => (
                    <>
                      <Checkbox
                        key={`service-${checkboxKey}-${value}`}
                        id="service-term-checkbox"
                        name="serviceTermAgree"
                        size="md"
                        label="[필수] 서비스 이용약관에 동의합니다."
                        defaultChecked={value}
                        onChange={async (next) => {
                          onChange(next);
                          setValue("serviceTermAgree", next);
                          await trigger("serviceTermAgree");
                        }}
                      />
                      {/* Hidden input for FormData */}
                      <input
                        type="hidden"
                        name="serviceTermAgree"
                        value={value ? "true" : "false"}
                      />
                    </>
                  )}
                />
              </div>
              <TermsButton
                type="service"
                className="text-text-basic hover:text-text-primary transition-colors"
              >
                보기
              </TermsButton>
            </div>
            <div className="flex flex-row items-center">
              <div className="flex-1">
                <Controller
                  control={control}
                  name="privacyPolicyAgree"
                  render={({ field: { value, onChange } }) => (
                    <>
                      <Checkbox
                        key={`privacy-${checkboxKey}-${value}`}
                        id="privacy-policy-checkbox"
                        name="privacyPolicyAgree"
                        size="md"
                        label="[필수] 개인정보의 수집에 동의합니다."
                        defaultChecked={value}
                        onChange={async (next) => {
                          onChange(next);
                          setValue("privacyPolicyAgree", next);
                          await trigger("privacyPolicyAgree");
                        }}
                      />
                      {/* Hidden input for FormData */}
                      <input
                        type="hidden"
                        name="privacyPolicyAgree"
                        value={value ? "true" : "false"}
                      />
                    </>
                  )}
                />
              </div>
              <TermsButton
                type="privacy"
                className="text-text-basic hover:text-text-primary transition-colors"
              >
                보기
              </TermsButton>
            </div>
          </div>
          {(errors.serviceTermAgree?.message ||
            errors.privacyPolicyAgree?.message) && (
            <Label id="terms" size={"s"} className="text-text-danger">
              {errors.serviceTermAgree?.message ||
                errors.privacyPolicyAgree?.message}
            </Label>
          )}
        </section>
        <Label id="root" size={"s"} className="text-text-danger">
          {errors.root?.message}
        </Label>
        <Button
          type="button"
          size="large"
          disabled={isLoading || !isValid}
          onClick={handleValidateAndShowModal}
        >
          회원가입
        </Button>
        <InfoText>
          회칙 2장 제4조(자격과 구성)에 의거하여 부원 가입대상을{" "}
          <span className="font-bold">한양대학교 재·휴·졸업생</span>으로
          한정함에 따라 한양대학교 이메일을 통한 로그인/회원가입을 진행하고
          있습니다. 아직 한양메일을 만드시지 않았다면{" "}
          <Link
            size="s"
            href="https://hanyang.ac.kr"
            rel="noopener noreferrer"
            target="_blank"
            className="text-text-primary"
          >
            다음 링크
          </Link>
          를 따라 만드실 수 있습니다.
        </InfoText>
      </Form>

      <SignUpConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSignUp}
        formValues={watchedValues}
      />
    </div>
  );
}
