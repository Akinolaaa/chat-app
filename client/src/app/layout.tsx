import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from "@/contexts/userContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Chat App",
	description: "Chat with Random Folks Online",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<UserProvider>{children}</UserProvider>
			</body>
		</html>
	);
}
