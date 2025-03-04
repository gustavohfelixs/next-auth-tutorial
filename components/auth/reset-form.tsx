"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from "../ui/form";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, ResetSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useTransition } from "react";
import { FormError } from "../form-error";
import { sendResetPasswordEmail } from "@/actions/reset-password";
import { FormSuccess } from "../form-success";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    startTransition(() => {
      sendResetPasswordEmail(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Reset your password"
      backButtonHref="/auth/login"
      backButtonLabel="Return to login"
    >
      <div className="flex items-center w-full justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="example.123@email.com"
                        type="email"
                        disabled={isPending}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormError message={error}></FormError>
              <FormSuccess message={success}></FormSuccess>
            </div>
            <Button className="w-full" type="submit">
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </CardWrapper>
  );
};
