export const sortOptions = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export const contractLengthOptions = [
  { value: "all", label: "All Lengths" },
  { value: "length-asc", label: "Length: Short to Long" },
  { value: "length-desc", label: "Length: Long to Short" },
  { value: "0-6", label: "0-6 Months" },
  { value: "7-12", label: "7-12 Months" },
  { value: "13+", label: "13+ Months" },
];

export const planTypeOptions = [
  { value: "all", label: "All Plan Types" },
  { value: "fixed", label: "Fixed Rate Only" },
  { value: "variable", label: "Variable Rate Only" },
];

export const prepaidOptions = [
  { value: "all", label: "Show All" },
  { value: "prepaid-only", label: "Prepaid Only" },
  { value: "no-prepaid", label: "Do Not Show Prepaid Plans" },
];

export const timeOfUseOptions = [
  { value: "all", label: "Show All" },
  { value: "tou-only", label: "Time of Use Only" },
  { value: "no-tou", label: "No Time of Use" },
];

export const renewableOptions = [
  { value: "all", label: "Show All" },
  { value: "100", label: "100% Renewable" },
  { value: "50", label: "50%+ Renewable" },
  { value: "25", label: "25%+ Renewable" },
  { value: "0-25", label: "0-25% Renewable" },
];

export const cancellationFeeOptions = [
  { value: "all", label: "All Fees" },
  { value: "under-50", label: "Under $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "100-200", label: "$100 - $200" },
  { value: "over-200", label: "Over $200" },
];