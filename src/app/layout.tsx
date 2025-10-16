import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Currency Converter",
	description:
		"A simple currency converter built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.",
	keywords: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "React"],
	authors: [{ name: "Ked.ss" }],
	icons: {
		icon: "",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
			>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
