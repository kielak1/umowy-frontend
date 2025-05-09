"use client";

import {
  ZmianaUmowaDoForm,
  SlownikKategoriaUmowy,
  SlownikWlasciciel,
  SlownikStatusUmowy,
  SlownikKlasyfikacjaUmowy,
  SlownikObszarFunkcjonalny,
} from "@/app/contracts/grid/types";

type Props = {
  index: number;
  zmiana: ZmianaUmowaDoForm;
  onChange: (index: number, updated: ZmianaUmowaDoForm) => void;
  onDelete: (index: number) => void;
  kategorie: SlownikKategoriaUmowy[];
  wlasciciele: SlownikWlasciciel[];
  statusy: SlownikStatusUmowy[];
  klasyfikacje: SlownikKlasyfikacjaUmowy[];
  obszary: SlownikObszarFunkcjonalny[];
};

export default function FormularzZmiana({
  index,
  zmiana,
  onChange,
  onDelete,
  kategorie,
  wlasciciele,
  statusy,
  klasyfikacje,
  obszary,
}: Props) {
  const isInvalid = {
    data_zawarcia: !zmiana.data_zawarcia,
    data_obowiazywania_od: !zmiana.data_obowiazywania_od,
    kwota_netto: zmiana.kwota_netto === null || zmiana.kwota_netto === "",
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const rawValue = e.target.value;
    const name = e.target.name;
    let newValue: string | number | boolean | null = rawValue;

    if (e.target.type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (name.endsWith("_id")) {
      newValue = rawValue === "" ? null : parseInt(rawValue, 10);
    }

    onChange(index, {
      ...zmiana,
      [name]: newValue,
    });
  };

  const handleMultiCheckboxChange = (id: number) => {
    const aktualne = zmiana.obszary_funkcjonalne_ids ?? [];
    const isSelected = aktualne.includes(id);
    const nowe = isSelected
      ? aktualne.filter((x) => x !== id)
      : [...aktualne, id];
    onChange(index, {
      ...zmiana,
      obszary_funkcjonalne_ids: nowe,
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
          value={zmiana.data_zawarcia ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
        {isInvalid.data_zawarcia && (
          <p className="text-red-600 text-sm mt-1">To pole jest wymagane</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Data obowiązywania od</label>
        <input
          type="date"
          name="data_obowiazywania_od"
          value={zmiana.data_obowiazywania_od ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
        {isInvalid.data_obowiazywania_od && (
          <p className="text-red-600 text-sm mt-1">To pole jest wymagane</p>
        )}
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
          value={zmiana.kwota_netto ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
        {isInvalid.kwota_netto && (
          <p className="text-red-600 text-sm mt-1">To pole jest wymagane</p>
        )}
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
          value={zmiana.opis ?? ""}
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

      {/* Słowniki */}
      <div>
        <label className="block font-medium">Kategoria</label>
        <select
          name="kategoria_id"
          value={zmiana.kategoria_id ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">-- wybierz --</option>
          {kategorie.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nazwa}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Właściciel</label>
        <select
          name="wlasciciel_id"
          value={zmiana.wlasciciel_id ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">-- wybierz --</option>
          {wlasciciele.map((w) => (
            <option key={w.id} value={w.id}>
              {w.nazwa}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Status</label>
        <select
          name="status_id"
          value={zmiana.status_id ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">-- wybierz --</option>
          {statusy.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nazwa}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Klasyfikacja</label>
        <select
          name="klasyfikacja_id"
          value={zmiana.klasyfikacja_id ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">-- wybierz --</option>
          {klasyfikacje.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nazwa}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Obszary funkcjonalne</label>
        <div className="space-y-1">
          {obszary.map((o) => (
            <label key={o.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  zmiana.obszary_funkcjonalne_ids?.includes(o.id) || false
                }
                onChange={() => handleMultiCheckboxChange(o.id)}
              />
              {o.nazwa}
            </label>
          ))}
        </div>
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
