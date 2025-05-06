import { Suspense } from "react";
import UmowaEdycjaClient from "./UmowaEdycjaClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Ładowanie formularza...</div>}>
      <UmowaEdycjaClient />
    </Suspense>
  );
}
