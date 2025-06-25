"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormError from "../FormError";
import FormSuccess from "../FormSuccess";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";

import { LoginSchema } from "@/lib/definitions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { login } from "@/actions/login";
import { usePathname, useRouter } from "next/navigation";

export default function LoginForm() {
  // const [isPending, setTransition] = useTransition();
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const pathname = usePathname();
  if (pathname !== "/login") {
    router.push("/login");
  }

  const handleLogin = async (value: z.infer<typeof LoginSchema>) => {
    console.log(value);
    setError("");
    setSuccess("");
    login(value).then((data) => {
      if (data?.error) {
        setError(data?.error);
      }
      if (data?.success) {
        router.push("/profile");
        setSuccess(data?.success);
      }
    });
    
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
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
                      placeholder="john.doe.gmail.com"
                      type="email"
                      // disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="********"
                      type="password"
                      // disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button type="submit" className="w-full" variant={"default"}>
            Login
          </Button>
        </form>
      </Form>
      
    </div>
  );
}
