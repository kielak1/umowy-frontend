"use client";

import {
  Umowa,
  Kontrahent,
  User,
  OrganizationalUnit,
} from "@/app/contracts/grid/types";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export type UmowaFormDataFragment = {
  numer: string;
  czy_ramowa: boolean;
  czy_dotyczy_konkretnych_uslug: boolean;
  czy_spelnia_dora: boolean;
  czy_wymaga_kontynuacji: boolean;
  wymagana_data_kontynuacji: string | null;
  kontrahent_id?: number;
  opiekun_id?: number;
  jednostka_organizacyjna_id?: number;
};

type Props = {
  umowa: Umowa;
  onChange: (dane: UmowaFormDataFragment) => void;
};

export default function FormularzDaneUmowy({ umowa, onChange }: Props) {
  const [formData, setFormData] = useState<UmowaFormDataFragment>({
    numer: umowa.numer,
    czy_ramowa: umowa.czy_ramowa,
    czy_dotyczy_konkretnych_uslug: umowa.czy_dotyczy_konkretnych_uslug,
    czy_spelnia_dora: umowa.czy_spelnia_dora,
    czy_wymaga_kontynuacji: umowa.czy_wymaga_kontynuacji,
    wymagana_data_kontynuacji: umowa.wymagana_data_kontynuacji ?? "",
    kontrahent_id: umowa.kontrahent?.id,
    opiekun_id: umowa.opiekun?.id,
    jednostka_organizacyjna_id: umowa.jednostka_organizacyjna?.id,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [kontrahenci, setKontrahenci] = useState<Kontrahent[]>([]);
  const [uzytkownicy, setUzytkownicy] = useState<User[]>([]);
  const [jednostki, setJednostki] = useState<OrganizationalUnit[]>([]);

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [kontrahenciRes, uzytkownicyRes, jednostkiRes] =
          await Promise.all([
            fetchWithAuth(
              `${process.env.NEXT_PUBLIC_API_URL}/api/kontrahenci/`
            ),
            fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/users/`),
            fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/orgunits/`),
          ]);

        if (!kontrahenciRes.ok || !uzytkownicyRes.ok || !jednostkiRes.ok) {
          throw new Error("Błąd podczas pobierania danych słownikowych");
        }

        setKontrahenci(await kontrahenciRes.json());
        setUzytkownicy(await uzytkownicyRes.json());
        setJednostki(await jednostkiRes.json());
      } catch (err) {
        console.error("❌ Błąd pobierania danych słownikowych:", err);
      }
    };

    fetchAll();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.numer.trim()) newErrors.numer = "Numer umowy jest wymagany";
    if (!formData.kontrahent_id)
      newErrors.kontrahent_id = "Wybierz kontrahenta";
    if (!formData.opiekun_id) newErrors.opiekun_id = "Wybierz opiekuna";
    if (!formData.jednostka_organizacyjna_id)
      newErrors.jednostka_organizacyjna_id = "Wybierz jednostkę organizacyjną";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // do walidacji dostęp z zewnątrz
  if (typeof window !== "undefined") {
    window.__validateUmowaForm = validate;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(newValue) : newValue,
    }));
  };

  return (
    <fieldset className="space-y-4 border p-4 rounded">
      <legend className="font-semibold text-lg">Dane umowy</legend>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Numer umowy *</label>
          <input
            type="text"
            name="numer"
            value={formData.numer}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
          {errors.numer && (
            <p className="text-red-600 text-sm">{errors.numer}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Kontrahent *</label>
          <select
            name="kontrahent_id"
            value={formData.kontrahent_id ?? ""}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">-- wybierz --</option>
            {kontrahenci.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nazwa}
              </option>
            ))}
          </select>
          {errors.kontrahent_id && (
            <p className="text-red-600 text-sm">{errors.kontrahent_id}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {[
          ["czy_ramowa", "Ramowa"],
          ["czy_dotyczy_konkretnych_uslug", "Dotyczy konkretnych usług"],
          ["czy_spelnia_dora", "Spełnia DORA"],
          ["czy_wymaga_kontynuacji", "Wymaga kontynuacji"],
        ].map(([name, label]) => (
          <label key={name} className="flex items-center gap-2">
            <input
              type="checkbox"
              name={name}
              checked={formData[name as keyof typeof formData] as boolean}
              onChange={handleChange}
            />
            {label}
          </label>
        ))}

        {formData.czy_wymaga_kontynuacji && (
          <div className="flex items-center gap-4 border p-2 rounded">
            <label className="font-medium w-48">Data kontynuacji</label>
            <input
              type="date"
              name="wymagana_data_kontynuacji"
              value={formData.wymagana_data_kontynuacji ?? ""}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-1"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 border p-2 rounded">
          <label className="font-medium w-48">Opiekun *</label>
          <div className="flex-1">
            <select
              name="opiekun_id"
              value={formData.opiekun_id ?? ""}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="">-- wybierz --</option>
              {uzytkownicy.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </select>
            {errors.opiekun_id && (
              <p className="text-red-600 text-sm">{errors.opiekun_id}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 border p-2 rounded">
          <label className="font-medium w-48">Jednostka organizacyjna *</label>
          <div className="flex-1">
            <select
              name="jednostka_organizacyjna_id"
              value={formData.jednostka_organizacyjna_id ?? ""}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="">-- wybierz --</option>
              {jednostki.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.name}
                </option>
              ))}
            </select>
            {errors.jednostka_organizacyjna_id && (
              <p className="text-red-600 text-sm">
                {errors.jednostka_organizacyjna_id}
              </p>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
