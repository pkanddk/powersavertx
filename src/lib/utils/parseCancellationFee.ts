export function parseCancellationFee(pricingDetails: string | null): number | null {
  if (!pricingDetails) return null;
  
  // Convert to lowercase for case-insensitive matching
  const lowerDetails = pricingDetails.toLowerCase();
  
  // Check for explicit "no cancellation fee" statements or $0 fees
  if (lowerDetails.includes('no cancellation fee') || 
      lowerDetails.includes('no early termination fee') ||
      lowerDetails.includes('$0 cancellation fee') ||
      lowerDetails.includes('cancellation fee: $0') ||
      lowerDetails.includes('cancellation fee: $0.00')) {
    return 0;
  }
  
  // Look for standard cancellation fee format
  const match = pricingDetails.match(/Cancellation Fee:\s*\$?(\d+(?:\.\d{2})?)/i);
  
  if (match) {
    return parseFloat(match[1]);
  }
  
  return null;
}