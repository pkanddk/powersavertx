import { Plan } from "@/lib/api";

export const getCompanyOptions = (plans?: Plan[]) => {
  const companies = Array.from(new Set(plans?.map(plan => plan.company_id))).map(id => {
    const plan = plans?.find(p => p.company_id === id);
    return {
      id: plan?.company_id || '',
      name: plan?.company_name || ''
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  return [
    { value: "all", label: "All Companies" },
    ...companies.map(company => ({
      value: company.id,
      label: company.name,
    })),
  ];
};