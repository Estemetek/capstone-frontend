// src/services/api.ts

// Define the structure of a Donation asset (adjust fields to match your blockchain data model)
export interface Donation {
  ID: string;                // corresponds to "ID"
  Owner: string;             // corresponds to "Owner"
  Color?: string;            // corresponds to "Color"
  AppraisedValue?: number;   // corresponds to "AppraisedValue"
  Size?: number;             // add this to match your current asset
  [key: string]: any;        // still allows extra fields for future flexibility
}


// Base URL for backend API
// const API_BASE_URL = "http://localhost:3000/api";
const API_BASE_URL = "http://192.168.254.106:3000/api";

/**
 * Fetch all donations from backend
 */
export async function getDonations(): Promise<Donation[]> {
  const response = await fetch(`${API_BASE_URL}/donations`);
  if (!response.ok) {
    throw new Error(`Failed to fetch donations: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Create a new donation asset
 */
export async function createDonation(asset: Partial<Donation>): Promise<Donation> {
  const response = await fetch(`${API_BASE_URL}/donations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(asset),
  });

  if (!response.ok) {
    throw new Error(`Failed to create donation: ${response.statusText}`);
  }

  return response.json();
}
