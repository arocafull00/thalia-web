import FinancialCategoriesManager from "@/components/settings/financial-categories/financial-categories-manager";
import { getTransactionCategories } from "@/dal/transaction-categories.server.dal";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";

export default async function SettingsClinicaPage() {
  const clinicId = await getServerActiveClinicId();
  const categories = await getTransactionCategories(clinicId);

  return <FinancialCategoriesManager initialCategories={categories} />;
}
