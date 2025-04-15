import AuthForm from "@/src/components/AuthForm";

export default async function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h1>Login</h1>
      <div>
        <AuthForm />
      </div>
    </div>
  );
}
