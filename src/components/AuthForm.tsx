"use client";
import Email from "next-auth/providers/email";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import Input from "./inputs/input";
import Button from "./Button";
import AuthSocialButton from "./AuthSocialButton";
import {BsGithub, BsGoogle} from "react-icons/bs"; 
import { signIn } from "next-auth/react";

type Variant = "LOGIN" | "REGISTER";

export default function AuthForm() {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      //axios register
    }

    if (variant === "LOGIN") {
      // nextauth SignIn
    }

    const socialAction = (action: string) => {
      setIsLoading(true);

      //next auth social Signin
    };
  };

  return (
    <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input id="name" label="Name" register={register} errors={errors} />
          )}
          <Input
            id="email"
            label="Email Address"
            type="email"
            register={register}
            errors={errors}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
          />
          <div>
           <Button
            disabled={isLoading}
            fullWidth
            type="submit"
           >
            {variant === "LOGIN" ? "Sign In" : "Register"}
           </Button>
          </div>
        </form>
        <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"/>

              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <AuthSocialButton title="google" icon={BsGoogle} onClick={() => signIn('google')}/>
              <AuthSocialButton title="github" icon={BsGithub} onClick={() => signIn('github')}/>

            </div>
          </div>
        <div 
          className="
          flex
          gap-2
          justify-center
          text-sm
          mt-6
          px-2
          text-gray-500
        ">
          <div>
            {variant === "LOGIN" ? "New to SIDEQUE$T?" : "Already have an account?"}
          </div>
          <div
            onClick={toggleVariant}
            className="underline cursor-pointer"

          >
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>

        </div>

      </div>
    </div>
  );
}
