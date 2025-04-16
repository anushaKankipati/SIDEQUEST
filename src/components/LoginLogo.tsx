import Image from "next/image";

export default function LoginLogo() {
  return (
    <div className="flex justify-center align-center flex-col">
      <Image
        src={"/images/roundlogo.png"}
        alt="SideQuest Logo"
        width={250}
        height={250}
        className="object-contain"
      />
      <h1 className="text-center text-xl font-bold">Sign in to your account</h1>
    </div>
  );
}
