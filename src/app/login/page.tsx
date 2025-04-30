import AuthForm from "@/src/components/AuthForm";
import LoginLogo from "@/src/components/LoginLogo";

export default async function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 short:mt-14 tall:mt-0">
      <LoginLogo/>
      <AuthForm />
    </div>
  );
}
