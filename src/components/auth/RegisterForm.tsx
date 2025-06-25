"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  // InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "@/lib/definitions";
import { useState } from "react";
import { register } from "@/actions/register";
// import FormSuccess from "../FormSuccess";
import FormError from "../FormError";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
// import { signIn } from "@/auth";
import { otpLogin } from "@/actions/login";

export function SignupForm() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  console.log(error, success);
  // const [isPending, setTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [verifyInfo, setVerifyInfo] = useState({
    email: "",
    otp: "",
    activeStatus: false,
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    register(values).then((data) => {
      // console.log(data);
      if (data?.error) {
        setError(data?.error);
      }
      if (data.success) {
        toast.success(data?.success);
        setVerifyInfo({
          ...verifyInfo,
          email: values.email,
          activeStatus: true,
        });
        setSuccess(data?.success);
        
      }
    });
  };

  const handleVerification = async () => {
    const values = {
      email: verifyInfo.email,
      otp: verifyInfo.otp,
    };
    setError("");
    setSuccess("");
    otpLogin(values).then((data) => {
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Rohit Mishra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@gmail.com"
                    {...field}
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
                  <Input placeholder="********" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <FormError message={error} />}
          {/* {success && <FormSuccess message={success} />} */}
          {!verifyInfo.activeStatus && (
            <Button type="submit" className="w-full" variant={"default"}>
              Create
            </Button>
          )}
        </form>
      </Form>
      {verifyInfo.activeStatus && (
        <div className="space-y-2 flex flex-col items-center">
          <InputOTP
            maxLength={6}
            value={verifyInfo.otp}
            onChange={(value) => setVerifyInfo({ ...verifyInfo, otp: value })}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className="text-center text-sm">
            {verifyInfo.otp === "" ? (
              <>Enter your one-time password.</>
            ) : (
              <>You entered: {verifyInfo.otp}</>
            )}
          </div>
          <Button
            onClick={handleVerification}
            className="w-full"
            variant={"default"}
          >
            Verify Otp
          </Button>
        </div>
      )}
    </div>
  );
}
