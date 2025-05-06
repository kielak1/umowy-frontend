"use client";

import { useState } from "react";
import { UmowaFormData } from "@/app/contracts/grid/types";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export function useUmowaForm(initial: UmowaFormData) {
  const [formData, setFormData] = useState<UmowaFormData>(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    const newValue =
      type === "checkbox" && "checked" in e.target
        ? (e.target as HTMLInputElement).checked
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const submit = async (umowaId: number) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/umowy/${umowaId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Błąd podczas zapisu danych umowy");
      }

      setSuccessMessage("Dane umowy zapisane pomyślnie.");
    } catch (err) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Nieznany błąd");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    submit,
    isSubmitting,
    submitError,
    successMessage,
  };
}
