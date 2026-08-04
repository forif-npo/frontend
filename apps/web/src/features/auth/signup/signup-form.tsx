"use client";
import { TermsButton } from "@/components/terms-modal";
import { departmentsOptions } from "@/constants/options.constant";
import { MemberEligibilityInfo } from "@/features/auth/member-eligibility-info";
import { autoHyphenPhoneNumber } from "@/utils/form";
import { signUpSchema, SignUpValues } from "@core/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button, Checkbox, SelectBox, TextInput } from "@ui/components/client";
import { Label } from "@ui/components/server";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  const { update } = useSession();
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

  useEffect(() => {
    if (!state.success) return;

    void update().then(() => {
      router.push("/signup/complete");
      router.refresh();
    });
  }, [router, state.success, update]);

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
        className="flex flex-col justify-center gap-8"
      >
        <TextInput
          autoComplete="email"
          id="email"
          length="full"
          title="이메일"
          required
          error={errors.email?.message ? errors.email?.message : undefined}
          {...register("email")}
          value={email}
          readOnly
        />
        <TextInput
          length="full"
          title="학번"
          helpText="학번은 입학년도로 시작하는 10자리로 구성되어 있습니다."
          required
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
          required
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
                required
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
          required
          id="phoneNumber"
          placeholder="010-0000-0000"
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
                onConfirm={() => {
                  setValue("serviceTermAgree", true);
                  void trigger("serviceTermAgree");
                }}
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
                onConfirm={() => {
                  setValue("privacyPolicyAgree", true);
                  void trigger("privacyPolicyAgree");
                }}
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
        <MemberEligibilityInfo />
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
