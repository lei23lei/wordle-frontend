"use client";
import CustomizedButton from "@/components/customized-button";
import Logo from "@/components/logo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-[calc(100vh-100px)] gap-4">
      <div className="-mt-20 mb-20">
        <Logo />
      </div>
      {/* <CustomizedButton onClick={() => alert("Button clicked!")}>
        Click Me
      </CustomizedButton> */}
      <div className="flex flex-col gap-4">
        <Link href="/one-player" passHref legacyBehavior>
          <CustomizedButton className="w-full">One Player</CustomizedButton>
        </Link>
        <Link href="/two-player" passHref legacyBehavior>
          <CustomizedButton className="w-full">Two Player</CustomizedButton>
        </Link>
      </div>
    </div>
  );
}
