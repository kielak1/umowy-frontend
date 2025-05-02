"use client";

import ZmianyGrid from "./ZmianyGrid";
import ZamowieniaGrid from "./ZamowieniaGrid";

interface Props {
  data: { id: number; czy_ramowa: boolean };
}

export default function UmowaDetails({ data }: Props) {
  return (
    <div className="p-4 bg-gray-50 border rounded text-sm space-y-6">
      <ZmianyGrid umowaId={Math.abs(data.id)} />
      {data.czy_ramowa && <ZamowieniaGrid umowaId={Math.abs(data.id)} />}
    </div>
  );
}
