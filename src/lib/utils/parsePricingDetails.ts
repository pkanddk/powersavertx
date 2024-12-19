export function parseCancellationFee(pricingDetails: string | null): string | null {
  if (!pricingDetails) return null;
  
  // Add debug logging
  console.log('Raw pricing details:', pricingDetails);
  
  // Convert to lowercase for case-insensitive matching
  const lowerDetails = pricingDetails.toLowerCase();
  console.log('Lowercase pricing details:', lowerDetails);
  
  // Check for explicit "no cancellation fee" statements or $0 fees
  if (lowerDetails.includes('no cancellation fee') || 
      lowerDetails.includes('no early termination fee') ||
      lowerDetails.includes('$0 cancellation fee') ||
      lowerDetails.includes('cancellation fee: $0') ||
      lowerDetails.includes('cancellation fee: $0.00')) {
    console.log('Found no cancellation fee statement');
    return 'No cancellation fee';
  }
  
  // Look for standard cancellation fee format
  const match = pricingDetails.match(/Cancellation Fee:\s*\$?\s*([^\n]+)/i);
  console.log('Regex match result:', match);
  
  // If we found a match and it's some form of $0, treat it as no cancellation fee
  if (match) {
    const fee = match[1].trim();
    if (fee === '$0' || fee === '$0.00' || fee === '0' || fee === '0.00') {
      return 'No cancellation fee';
    }
    return fee;
  }
  
  return null;
}