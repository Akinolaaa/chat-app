"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogIn() {
  const router = useRouter();

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs p-8 bg-white rounded-lg shadow-lg">
        <form className="flex flex-col space-y-4">
          <label className="sr-only">Name</label>
          <input
            id="nameInput"
            className="rounded-lg h-auto border-b-2 min-h-8 p-2"
            placeholder="Input your name here"
            maxLength={20}
          ></input>

          <Button
            onClick={handleClick}
            type="submit"
            className="h-full min-w-min w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition duration-200"
          >
            Log In
          </Button>
        </form>
      </div>
    </main>
  );
}
