import { SignUpForm } from "@/features/auth/signup/signup-form";
import { signUpSchema } from "@core/schemas";
import { Heading } from "@ui/components/server";
import { getTranslations } from "next-intl/server";
import z from "zod/v4";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: z.infer<typeof signUpSchema>;
};

const submitForm = async (initialState: ActionState, formData: FormData) => {
  "use server";

  const values = {
    firstName: String(formData.get("firstName") || ""),
    lastName: String(formData.get("lastName") || ""),
  };

  const { error: parseError } = signUpSchema.safeParse(values);
  const errors: ActionState["errors"] = {};
  for (const { path, message } of parseError?.issues || []) {
    errors[path.join(".")] = { message };
  }
  // TODO: server-side validation
  // Save data in a database or send it to an API.

  return {
    values,
    errors: {},
  };
};

const getData = async () => {
  "use server";

  // Fetch data from a database or API.
  return { firstName: "John", lastName: "Doe" };
};

export default async function Page() {
  const data = await getData();
  const t = await getTranslations("SignUpPage");
  return (
    <div className="mx-auto mt-8 min-h-screen max-w-[800px]">
      <Heading size="s" className="text-text-basic text-left">
        {t("title")}
      </Heading>
      <Heading size="l" className="text-text-basic text-left">
        {t("description")}
      </Heading>
      <section className="mt-12 w-full">
        <SignUpForm action={submitForm} values={data} />
      </section>
    </div>
  );
}
