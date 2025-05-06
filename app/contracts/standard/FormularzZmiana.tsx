import { ZmianaUmowy } from "@/app/contracts/grid/types";

type Props = {
  index: number;
  zmiana: ZmianaUmowy;
  onChange: (index: number, updated: ZmianaUmowy) => void;
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
    const { name, value } = e.target;
    onChange(index, { ...zmiana, [name]: value });
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
        <label className="block font-medium">Kwota netto</label>
        <input
          type="number"
          name="kwota_netto"
          value={zmiana.kwota_netto ?? ""}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
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
