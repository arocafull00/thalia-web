export const APPOINTMENT_LIST_SELECT =
  "*, patients(id, full_name, phone), employees(id, full_name, color), appointment_inventory_items(*, inventory_items(id, name, unit, stock)), appointment_treatments(*, appointment_treatment_prices(price_at_booking), treatment(id, name, color, duration_minutes, treatment_prices(price), treatment_inventory_items(*, inventory_items(id, name, unit, stock))))";

export const APPOINTMENT_DETAIL_SELECT =
  "*, patients(id, full_name, phone, avatar_url), employees(id, full_name, color, specialty, role, avatar_url), appointment_treatments(*, appointment_treatment_prices(price_at_booking), treatment(id, name, color, duration_minutes, treatment_prices(price)))";

export const TREATMENT_DETAIL_SELECT =
  "*, treatment_prices(price), treatment_inventory_items(*, inventory_items(id, name, unit))";

export const TREATMENT_LIST_SELECT =
  "*, treatment_prices(price), treatment_inventory_items(id)";
