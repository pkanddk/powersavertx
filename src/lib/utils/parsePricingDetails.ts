export function parseCancellationFee(pricingDetails: string | null): string | null {
  if (!pricingDetails) return null;
  
  const match = pricingDetails.match(/Cancellation Fee:\s*\$?\s*([^\n]+)/i);
  return match ? match[1].trim() : null;
}