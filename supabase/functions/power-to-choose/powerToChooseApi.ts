// This is the implementation of the fetchPlans function
export async function fetchPlans(zipCode: string, estimatedUse?: string) {
  const baseUrl = "http://www.powertochoose.org/en-us/service/v1";
  
  try {
    const response = await fetch(`${baseUrl}/offers/getoffers?zip=${zipCode}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch plans: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
}