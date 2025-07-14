import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">Peter's Wordle</h1>
      <div className="flex flex-col gap-4">
        <Button asChild>
          <Link href="/one-player">One Player</Link>
        </Button>
        <Button asChild>
          <Link href="/two-player">Two Player</Link>
        </Button>
      </div>
    </div>
  );
}
