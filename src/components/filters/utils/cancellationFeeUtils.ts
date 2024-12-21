export const handleCancellationFeeChange = (value: string): [number, number] => {
  switch (value) {
    case "under-50":
      return [0, 49];
    case "50-100":
      return [50, 100];
    case "100-200":
      return [100, 200];
    case "over-200":
      return [201, 99999];
    default:
      return [0, 99999];
  }
};

export const getCurrentCancellationFeeValue = (fee: [number, number]): string => {
  const [min, max] = fee;
  if (min === 0 && max === 49) return "under-50";
  if (min === 50 && max === 100) return "50-100";
  if (min === 100 && max === 200) return "100-200";
  if (min === 201) return "over-200";
  return "all";
};