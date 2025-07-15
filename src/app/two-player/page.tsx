import Link from "next/link";
import CustomizedButton from "@/components/customized-button";

export default function TwoPlayerComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
      <span className="text-6xl mb-4">🚧</span>
      <h1 className="text-4xl font-bold mb-2 text-center">Coming Soon</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-md mb-6">
        The two-player mode is under construction.
        <br />
        Stay tuned for more fun and challenge!
      </p>
      <Link href="/">
        <CustomizedButton>Return Home</CustomizedButton>
      </Link>
    </div>
  );
}
