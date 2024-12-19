export function parseCancellationFee(pricingDetails: string | null): string | null {
  if (!pricingDetails) return null;
  
  // Add debug logging
  console.log('Raw pricing details:', pricingDetails);
  
  // Convert to lowercase for case-insensitive matching
  const lowerDetails = pricingDetails.toLowerCase();
  console.log('Lowercase pricing details:', lowerDetails);
  
  // Check for explicit "no cancellation fee" statements
  if (lowerDetails.includes('no cancellation fee') || 
      lowerDetails.includes('no early termination fee') ||
      lowerDetails.includes('$0 cancellation fee') ||
      lowerDetails.includes('cancellation fee: $0')) {
    console.log('Found no cancellation fee statement');
    return 'No cancellation fee';
  }
  
  // Look for standard cancellation fee format
  const match = pricingDetails.match(/Cancellation Fee:\s*\$?\s*([^\n]+)/i);
  console.log('Regex match result:', match);
  return match ? match[1].trim() : null;
}