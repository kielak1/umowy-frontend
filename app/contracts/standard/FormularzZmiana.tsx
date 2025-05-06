"use client";

import { ZmianaUmowaDoForm } from "@/app/contracts/grid/types";

type Props = {
  index: number;
  zmiana: ZmianaUmowaDoForm;
  onChange: (index: number, updated: ZmianaUmowaDoForm) => void;
  onDelete: (index: number) => void;
};

export default function FormularzZmiana({
  index,
  zmiana,
  onChange,
  onDelete,
}: Props) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    onChange(index, {
      ...zmiana,
      [name]: newValue,
    });
  };

  return (
    <fieldset className="border p-4 rounded space-y-2">
      <legend className="font-semibold">Zmiana #{index + 1}</legend>

      <div>
        <label className="block font-medium">Rodzaj</label>
        <select
          name="rodzaj"
          value={zmiana.rodzaj}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="umowa">Umowa</option>
          <option value="aneks">Aneks</option>
          <option value="porozumienie">Porozumienie</option>
          <option value="inne">Inna zmiana</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Data zawarcia</label>
        <input
          type="date"
          name="data_zawarcia"
          value={zmiana.data_zawarcia}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block font-medium">Data obowiązywania od</label>
        <input
          type="date"
          name="data_obowiazywania_od"
          value={zmiana.data_obowiazywania_od}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block font-medium">Data obowiązywania do</label>
        <input
          type="date"
          name="data_obowiazywania_do"
          value={zmiana.data_obowiazywania_do ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block font-medium">Kwota netto</label>
        <input
          type="number"
          name="kwota_netto"
          value={zmiana.kwota_netto}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block font-medium">Waluta</label>
        <select
          name="waluta"
          value={zmiana.waluta}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        >
          <option value="PLN">PLN</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Opis</label>
        <textarea
          name="opis"
          value={zmiana.opis}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Numer umowy dostawcy</label>
        <input
          type="text"
          name="numer_umowy_dostawcy"
          value={zmiana.numer_umowy_dostawcy ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Przedmiot</label>
        <input
          type="text"
          name="przedmiot"
          value={zmiana.przedmiot ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Producenci</label>
        <input
          type="text"
          name="producenci"
          value={zmiana.producenci ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Data podpisania</label>
        <input
          type="date"
          name="data_podpisania"
          value={zmiana.data_podpisania ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block font-medium">Data wypowiedzenia</label>
        <input
          type="date"
          name="data_wypowiedzenia"
          value={zmiana.data_wypowiedzenia ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="trzeba_wypowiedziec"
            checked={zmiana.trzeba_wypowiedziec}
            onChange={handleChange}
          />
          Trzeba wypowiedzieć
        </label>
      </div>

      <div>
        <label className="block font-medium">Finansowanie do</label>
        <input
          type="date"
          name="finansowanie_do"
          value={zmiana.finansowanie_do ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
      </div>

      <button
        type="button"
        onClick={() => onDelete(index)}
        className="text-red-600 underline text-sm mt-2"
      >
        Usuń zmianę
      </button>
    </fieldset>
  );
}
