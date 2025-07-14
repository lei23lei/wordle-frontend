import Blanks from "@/components/blanks";
import Keyboard from "@/components/keyboard";

export default function OnePlayer() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <Blanks />
        <Keyboard
          onKeyPress={() => {}}
          disabledKeys={[]}
          correctKeys={[]}
          presentKeys={[]}
          absentKeys={[]}
        />
      </div>
    </div>
  );
}
