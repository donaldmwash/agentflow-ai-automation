import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "AgentFlow — AI workflow automation", description: "Build intelligent agents and automate the work that matters." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
