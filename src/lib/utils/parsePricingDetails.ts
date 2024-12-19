export function parseCancellationFee(pricingDetails: string | null): string | null {
  if (!pricingDetails) return null;
  
  // Convert to lowercase for case-insensitive matching
  const lowerDetails = pricingDetails.toLowerCase();
  
  // Check for explicit "no cancellation fee" statements
  if (lowerDetails.includes('no cancellation fee') || 
      lowerDetails.includes('no early termination fee') ||
      lowerDetails.includes('$0 cancellation fee') ||
      lowerDetails.includes('cancellation fee: $0')) {
    return 'No cancellation fee';
  }
  
  // Look for standard cancellation fee format
  const match = pricingDetails.match(/Cancellation Fee:\s*\$?\s*([^\n]+)/i);
  return match ? match[1].trim() : null;
}