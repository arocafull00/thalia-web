import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { INVENTORY_ITEM_CREATE_COPY } from "@/copy/inventory-item-create-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useCreateInventoryItem } from "@/lib/hooks/use-inventory";

function parseOptionalNumber(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

export function useInventoryItemCreateDialog(onSuccess: () => void) {
  const clinicId = useClinicId();
  const { mutate, isPending } = useCreateInventoryItem();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [stock, setStock] = useState("0");
  const [minStock, setMinStock] = useState("0");
  const [unitPrice, setUnitPrice] = useState("");

  const reset = useCallback(() => {
    setName("");
    setCategory("");
    setUnit("");
    setStock("0");
    setMinStock("0");
    setUnitPrice("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (!name.trim()) {
      toast.error(INVENTORY_ITEM_CREATE_COPY.validation.nameRequired);
      return;
    }

    if (!clinicId) {
      toast.error(INVENTORY_ITEM_CREATE_COPY.validation.clinicRequired);
      return;
    }

    const parsedStock = Number(stock);

    if (Number.isNaN(parsedStock)) {
      toast.error(INVENTORY_ITEM_CREATE_COPY.validation.stockInvalid);
      return;
    }

    const parsedMinStock = Number(minStock);

    if (Number.isNaN(parsedMinStock)) {
      toast.error(INVENTORY_ITEM_CREATE_COPY.validation.minStockInvalid);
      return;
    }

    const parsedUnitPrice = parseOptionalNumber(unitPrice);

    if (unitPrice.trim() && parsedUnitPrice === null) {
      toast.error(INVENTORY_ITEM_CREATE_COPY.validation.unitPriceInvalid);
      return;
    }

    mutate(
      {
        clinic_id: clinicId,
        name: name.trim(),
        category: category.trim() || null,
        unit: unit.trim() || null,
        stock: parsedStock,
        min_stock: parsedMinStock,
        unit_price: parsedUnitPrice,
      },
      {
        onSuccess: () => {
          toast.success(INVENTORY_ITEM_CREATE_COPY.success);
          reset();
          onSuccess();
        },
        onError: (cause) => {
          toast.error(cause.message || INVENTORY_ITEM_CREATE_COPY.error);
        },
      },
    );
  }, [
    category,
    clinicId,
    minStock,
    mutate,
    name,
    onSuccess,
    reset,
    stock,
    unit,
    unitPrice,
  ]);

  return {
    name,
    setName,
    category,
    setCategory,
    unit,
    setUnit,
    stock,
    setStock,
    minStock,
    setMinStock,
    unitPrice,
    setUnitPrice,
    isPending,
    reset,
    handleSubmit,
  };
}
