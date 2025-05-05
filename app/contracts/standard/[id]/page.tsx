"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  Kontrahent,
  OrganizationalUnit,
  User,
  UmowaFormData,
} from "@/app/contracts/grid/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function FormularzPelnejUmowy({ params }: { params: { id: string } }) {
  const umowaId = parseInt(params.id, 10);

  const { register, handleSubmit, control, setValue } = useForm<UmowaFormData>({
    defaultValues: {
      zmiany: [],
      zamowienia: [],
    },
  });

  const {
    fields: zmianyFields,
    append: appendZmiana,
    remove: removeZmiana,
  } = useFieldArray({ control, name: "zmiany" });

  const {
    fields: zamowieniaFields,
    append: appendZamowienie,
    remove: removeZamowienie,
  } = useFieldArray({ control, name: "zamowienia" });

  const [kontrahenci, setKontrahenci] = useState<Kontrahent[]>([]);
  const [uzytkownicy, setUzytkownicy] = useState<User[]>([]);
  const [jednostki, setJednostki] = useState<OrganizationalUnit[]>([]);

  useEffect(() => {
    // Ładowanie danych do selectów
    Promise.all([
      fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/kontrahenci/`).then((r) => r.json()),
      fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/users/`).then((r) => r.json()),
      fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/orgunits/`).then((r) => r.json()),
    ]).then(([kontrahenci, uzytkownicy, jednostki]) => {
      setKontrahenci(kontrahenci);
      setUzytkownicy(uzytkownicy);
      setJednostki(jednostki);
    });

    // Ładowanie danych umowy
    fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/umowy/${umowaId}/`)
      .then((res) => res.json())
      .then((data) => {
        setValue("numer", data.numer);
        setValue("kontrahent_id", data.kontrahent?.id ?? undefined);
        setValue("opiekun_id", data.opiekun?.id ?? undefined);
        setValue("jednostka_organizacyjna_id", data.jednostka_organizacyjna?.id ?? undefined);
        setValue("czy_ramowa", data.czy_ramowa);
        setValue("czy_dotyczy_konkretnych_uslug", data.czy_dotyczy_konkretnych_uslug);
        setValue("czy_spelnia_dora", data.czy_spelnia_dora);
        setValue("czy_wymaga_kontynuacji", data.czy_wymaga_kontynuacji);
        setValue("wymagana_data_kontynuacji", data.wymagana_data_kontynuacji ?? "");
        setValue("zmiany", data.zmiany ?? []);
        setValue("zamowienia", data.zamowienia ?? []);
      });
  }, [umowaId, setValue]);

  const onSubmit = (data: UmowaFormData) => {
    console.log("ZAPIS:", data);
    // TODO: implementacja PATCH /api/umowy/:id/ oraz zapis zmian/zamówień
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 p-6 bg-white shadow rounded-lg max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Numer CRB</Label>
          <Input {...register("numer")} />
        </div>
        <div>
          <Label>Kontrahent</Label>
          <select {...register("kontrahent_id")} className="w-full border px-2 py-2 rounded">
            <option value="">-- wybierz --</option>
            {kontrahenci.map((k) => (
              <option key={k.id} value={k.id}>{k.nazwa}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Opiekun</Label>
          <select {...register("opiekun_id")} className="w-full border px-2 py-2 rounded">
            <option value="">-- wybierz --</option>
            {uzytkownicy.map((u) => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Jednostka organizacyjna</Label>
          <select {...register("jednostka_organizacyjna_id")} className="w-full border px-2 py-2 rounded">
            <option value="">-- wybierz --</option>
            {jednostki.map((j) => (
              <option key={j.id} value={j.id}>{j.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <Checkbox {...register("czy_ramowa")} /> <Label>Czy ramowa</Label>
        <Checkbox {...register("czy_dotyczy_konkretnych_uslug")} /> <Label>Dotyczy usług</Label>
        <Checkbox {...register("czy_spelnia_dora")} /> <Label>Spełnia DORA</Label>
        <Checkbox {...register("czy_wymaga_kontynuacji")} /> <Label>Wymaga kontynuacji</Label>
      </div>

      <h2 className="text-xl font-semibold mt-8">Zmiany umowy</h2>
      {zmianyFields.map((field, index) => (
        <div key={field.id} className="border p-4 mb-4 rounded space-y-2">
          <Input {...register(`zmiany.${index}.przedmiot`)} placeholder="Przedmiot" />
          <Input type="date" {...register(`zmiany.${index}.data_zawarcia`)} />
          <Input type="number" step="0.01" {...register(`zmiany.${index}.kwota_netto`)} placeholder="Kwota netto" />
          <Button type="button" onClick={() => removeZmiana(index)} variant="destructive">Usuń zmianę</Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => appendZmiana({ przedmiot: "", data_zawarcia: "", kwota_netto: undefined })}
      >
        + Dodaj zmianę
      </Button>

      <h2 className="text-xl font-semibold mt-8">Zamówienia</h2>
      {zamowieniaFields.map((field, index) => (
        <div key={field.id} className="border p-4 mb-4 rounded space-y-2">
          <Input {...register(`zamowienia.${index}.przedmiot`)} placeholder="Przedmiot" />
          <Input type="date" {...register(`zamowienia.${index}.data_zlozenia`)} />
          <Input type="number" step="0.01" {...register(`zamowienia.${index}.kwota_netto`)} placeholder="Kwota netto" />
          <Button type="button" onClick={() => removeZamowienie(index)} variant="destructive">Usuń zamówienie</Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => appendZamowienie({ przedmiot: "", data_zlozenia: "", kwota_netto: undefined })}
      >
        + Dodaj zamówienie
      </Button>

      <div className="pt-4">
        <Button type="submit">Zapisz umowę i powiązane dane</Button>
      </div>
    </form>
  );
}
