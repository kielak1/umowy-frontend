import { ZamowienieDoForm } from "@/app/contracts/grid/types";

type Props = {
  index: number;
  zamowienie: ZamowienieDoForm;
  onChange: (index: number, updated: ZamowienieDoForm) => void;
  onDelete: (index: number) => void;
};

export default function FormularzZamowienie({
  index,
  zamowienie,
  onChange,
  onDelete,
}: Props) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    onChange(index, { ...zamowienie, [name]: value });
  };

  return (
    <fieldset className="border p-4 rounded space-y-4">
      <legend className="font-semibold">Zamówienie #{index + 1}</legend>

      {/* Pierwszy wiersz */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block font-medium">Numer zamówienia</label>
          <input
            type="text"
            name="numer_zamowienia"
            value={zamowienie.numer_zamowienia}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block font-medium">Data złożenia</label>
          <input
            type="date"
            name="data_zlozenia"
            value={zamowienie.data_zlozenia}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block font-medium">Data realizacji</label>
          <input
            type="date"
            name="data_realizacji"
            value={zamowienie.data_realizacji ?? ""}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block font-medium">Kwota netto</label>
          <input
            type="number"
            name="kwota_netto"
            value={zamowienie.kwota_netto}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block font-medium">Waluta</label>
          <select
            name="waluta"
            value={zamowienie.waluta}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="PLN">PLN</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      {/* Drugi wiersz */}
      <div>
        <label className="block font-medium">Opis</label>
        <textarea
          name="opis"
          value={zamowienie.opis}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <button
        type="button"
        onClick={() => onDelete(index)}
        className="text-red-600 underline text-sm"
      >
        Usuń zamówienie
      </button>
    </fieldset>
  );
}
