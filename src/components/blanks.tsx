export function Row({ word }: { word: string[] }) {
  return (
    <div className="flex flex-row gap-2 ">
      <div className="w-16 h-16 border-4  border-border rounded-md"></div>
      <div className="w-16 h-16 border-4  border-border rounded-md"></div>
      <div className="w-16 h-16 border-4  border-border rounded-md"></div>
      <div className="w-16 h-16 border-4  border-border rounded-md"></div>
      <div className="w-16 h-16 border-4  border-border rounded-md"></div>
    </div>
  );
}

export default function Blanks({ word }: { word: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <Row word={word} />
      <Row word={word} />
    </div>
  );
}
