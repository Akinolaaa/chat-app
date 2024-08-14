"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { useUserContext } from "@/contexts/userContext";
import { v4 as uuidv4 } from "uuid";

export default function LogIn() {
	const router = useRouter();
	const [name, setName] = useState("");
	const { setUser } = useUserContext();

	const onsubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!name.length) {
			return;
		}
		setUser({
			id: uuidv4(),
			name,
		});
		router.push("/chat");
	};

	return (
		<main className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
			<div className='w-full max-w-xs p-8 bg-white rounded-lg shadow-lg'>
				<form onSubmit={onsubmit} className='flex flex-col space-y-4'>
					<div className='relative'>
						<input
							id='nameInput'
							className='peer rounded-lg h-auto border-b-2 pl-2 placeholder-transparent focus:outline-none z-10'
							min='1'
							placeholder='t'
							onChange={(e) => setName(e.target.value)}
						></input>
						<label
							htmlFor='nameInput'
							className='absolute left-2 top-1 hover:cursor-text text-gray-400 transition-all peer-focus:-top-4 peer-focus:left-1 peer-focus:text-xs peer-focus:text-black'
						>
							Input your name here
						</label>
					</div>

					<Button
						type='submit'
						className='h-full min-w-min w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition duration-200'
					>
						Log In
					</Button>
				</form>
			</div>
		</main>
	);
}
