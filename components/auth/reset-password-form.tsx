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
import { NewPasswordSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState, useTransition } from "react";
import { FormError } from "../form-error";
import { resetPassword, verifyToken } from "@/actions/reset-password";
import { User } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { FormSuccess } from "../form-success";

export const ResetPasswordForm = () => {
  const [user, setUser] = useState<User | undefined>();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    verifyToken(token)
      .then((data) => {
        setError(data.error);
        setUser(data.existingUser);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  });

  // todo: Pegar token
  //validar token

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    startTransition(() => {
      if (user && token) {
        resetPassword(user, token, values).then((data) => {
          setError(data.error);
          setSuccess(data.success);
        });
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Reset your password"
      backButtonHref="/auth/login"
      backButtonLabel="Return to login"
    >
      <div className="flex items-center w-full justify-center">
        {!user && !error && !success && <BeatLoader></BeatLoader>}
        {!user && !success && <FormError message={error}></FormError>}
        {success && <FormSuccess message={success}></FormSuccess>}

        {!error && user && (
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="******"
                            type="password"
                            disabled={isPending}
                          ></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="*******"
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
        )}
      </div>
    </CardWrapper>
  );
};
