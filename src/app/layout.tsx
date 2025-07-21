import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/providers/store-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import Nav from "@/components/nav";
import Background from "@/components/background";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Peter Wordle",
  description: "Peter Wordle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="">
      <body className="bg-background relative  min-h-screen  ">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Background />
          <StoreProvider>
            <Nav />
            {children}
            <div className="absolute bottom-1 w-full">
              <Footer />
            </div>
            <Toaster />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
