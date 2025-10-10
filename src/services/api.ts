// src/services/api.ts

// -----------------------------
// Donation Interfaces
// -----------------------------
export interface BlockchainDonation {
  itemID: string;
  itemType: string;
  condition: string;
  donorID: string;
  currentOwner: string;
  status: string;
  timestamp: string;
}

export interface OffchainDonation {
  _id?: string;
  itemID: string;
  itemType: string;
  category?: string;
  condition: string;
  quantity: number;
  donorInfo: {
    name: string;
    email: string;
    contactNo: string;
  };
  recipientInfo?: {
    school?: string;
    contact?: string;
  };
  images: string[];
  notes?: string;
  appraisalValue?: number;
  qrCodeUrl?: string;   // qr
  createdAt?: string;
  __v?: number;
}

export interface DonationResponse {
  blockchain: BlockchainDonation;
  offchain: OffchainDonation;
  message?: string;
}

// -----------------------------
// User / Auth Interfaces
// -----------------------------
export interface User {
  id: string;       // Mongo _id
  name: string;
  email: string;
  role: string;
  contactNo?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// -----------------------------
// Beneficiary Interfaces
// -----------------------------
export interface Beneficiary {
  _id?: string;
  schoolName: string;
  schoolId: string;
  schoolType: string;
  classification: string;
  accreditation: {
    agency: string;
    status: string;
  };
  contactPerson?: string;
  contactEmail?: string;
  contactNumber?: string;
  address?: string;
  region?: string;
}

// -----------------------------
// Base API URL
// -----------------------------
//const API_BASE_URL =
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// -----------------------------
// Helper: fetch with auth token
// -----------------------------
async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
}

// -----------------------------
// Beneficiary APIs
// -----------------------------
export async function getBeneficiaries(): Promise<Beneficiary[]> {
  return authFetch(`${API_BASE_URL}/beneficiaries`);
}

export async function addBeneficiary(
  beneficiaryData: Beneficiary
): Promise<Beneficiary> {
  return authFetch(`${API_BASE_URL}/beneficiaries`, {
    method: "POST",
    body: JSON.stringify(beneficiaryData),
  });
}

// -----------------------------
// Donation APIs
// -----------------------------

export async function getDonations(donorID?: string): Promise<BlockchainDonation[]> {
  const url = donorID
    ? `${API_BASE_URL}/donations?donorID=${donorID}`
    : `${API_BASE_URL}/donations`;
  return authFetch(url);
}

// createDonation (revised)
export async function createDonation(
  donationData: Partial<
    OffchainDonation & { donorID: string; currentOwner: string; status: string }
  >
): Promise<DonationResponse> {
  const donorID = localStorage.getItem("userId") || "";
  const donorName = localStorage.getItem("userName") || "Unknown Donor";
  const donorEmail = localStorage.getItem("userEmail") || "unknown@example.com";
  const donorContact = localStorage.getItem("userContact") || "0000000000";

  return authFetch(`${API_BASE_URL}/donations`, {
    method: "POST",
    body: JSON.stringify({
      ...donationData,
      donorID,
      donorInfo: {
        name: donorName,
        email: donorEmail,
        contactNo: donorContact,
      },
      // 👇 ensure images are only URLs now
      images: donationData.images || [],
    }),
  });
}

// -----------------------------
// Auth APIs (signup & login)
// -----------------------------
export async function signup(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return authFetch(`${API_BASE_URL}/users/signup`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return authFetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getDonationById(id: string): Promise<DonationResponse> {
  return authFetch(`${API_BASE_URL}/donations/${id}`);
}

// export async function getDonationsByCategory(
//   category: string
// ): Promise<OffchainDonation[]> {
//   return authFetch(`${API_BASE_URL}/donations/category/${category}`);
// }
export async function getDonationsByCategory(
  category: string
): Promise<DonationResponse[]> {
  return authFetch(`${API_BASE_URL}/donations/category/${category}`);
}
