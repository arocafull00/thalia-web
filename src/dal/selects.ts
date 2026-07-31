export const APPOINTMENT_LIST_SELECT =
  "*, patients(id, full_name, phone), employees(id, full_name, color), appointment_inventory_items(*, inventory_items(id, name, unit, stock)), appointment_treatments(*, treatment(id, name, color, price, duration_minutes, treatment_inventory_items(*, inventory_items(id, name, unit, stock))))";

export const APPOINTMENT_DETAIL_SELECT =
  "*, patients(id, full_name, phone, avatar_url), employees(id, full_name, color, specialty, role, avatar_url), appointment_treatments(*, treatment(id, name, color, price, duration_minutes))";

export const TREATMENT_DETAIL_SELECT =
  "*, treatment_inventory_items(*, inventory_items(id, name, unit))";
