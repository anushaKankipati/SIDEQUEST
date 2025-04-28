import AuthForm from "@/src/components/AuthForm";
import LoginLogo from "@/src/components/LoginLogo";
import Image from "next/image";

export default async function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 mt-14 2xl:mt-0">
      <LoginLogo/>
      <AuthForm />
    </div>
  );
}
