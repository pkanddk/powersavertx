export function parseCancellationFee(pricingDetails: string | null): number | null {
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
    return 0;
  }
  
  // Look for standard cancellation fee format
  const match = pricingDetails.match(/Cancellation Fee:\s*\$?(\d+(?:\.\d{2})?)/i);
  console.log('Regex match result:', match);
  
  if (match) {
    return parseFloat(match[1]);
  }
  
  // If no cancellation fee is mentioned, return null
  return null;
}