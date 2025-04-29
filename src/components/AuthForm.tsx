"use client";
import Email from "next-auth/providers/email";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import Input from "./inputs/Input";
import Button from "./Button";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { signIn, useSession } from "next-auth/react";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-hot-toast";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

export default function AuthForm() {
  const session = useSession();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

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

    //TODO: add a checker for an oath2 flow with the same email
    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then((res: AxiosResponse<any>) => {
          const data = res.data;

          if (res.status !== 200 && res.status !== 201) {
            toast.error(data.error || "Unknown registration error");
            return;
          }

          toast.success("Registration successful!");
          setVariant("LOGIN");
        })
        .catch((error: any) => {
          // Axios error responses are also slightly different
          if (error.response && error.response.data) {
            toast.error(error.response.data.error || "Registration failed.");
          } else {
            toast.error("Registration error: " + error.message);
          }
        })
        .finally(() => {
          setIsLoading(false);
          router.push("/login");
        });
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials");
          }

          if (callback?.ok && !callback.error) {
            toast.success("Logged in!");
            router.push("/");
            router.refresh();
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const socialAction = (action: string) => {
    setIsLoading(true);
    console.log("\n\nsocialAction called\n\n");
    //next auth social Signin
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid Credentials");
        }

        if (callback?.ok && !callback.error) {
          toast.success("Logged in!");
          router.push("/");
          router.refresh();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
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
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "Sign In" : "Register"}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              title="google"
              icon={BsGoogle}
              onClick={() => {
                socialAction("google");
              }}
            />
            <AuthSocialButton
              title="github"
              icon={BsGithub}
              onClick={() => {
                socialAction("github");
              }}
            />
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
        "
        >
          <div>
            {variant === "LOGIN"
              ? "New to SIDEQUE$T?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
}
