import { LoginForm } from "@/components/LoginForm";

export default function loginPage() {
  return (
    <div className="min-h-screen flex bg-[#67636b]">
      <div className="flex w-full max-w-md m-auto  rounded-lg shadow-default py-10 px-16">
        <div className="flex flex-col w-full">
          <h1 className="text-2xl font-medium text-[#ffffff] mb-8">Log In</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
