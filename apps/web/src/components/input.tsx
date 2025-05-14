"use client";

import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@repo/core/schemas";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
export function Input() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      id: "",
      name: "",
      department: "",
    },
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    console.log(values);
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="id"
          render={({ field }) => <input placeholder="안녕하세요" {...field} />}
        />
        <ErrorMessage
          errors={errors}
          name="id"
          render={({ message }) => <p>{message}</p>}
        />
        <input type="submit" />
      </form>
    </FormProvider>
  );
}
