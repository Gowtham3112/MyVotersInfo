// ---------------- VOTER ----------------

export interface Voter {
  id: number;

  categoryId: number;
  partId: number;
  wardId: number;
  areaId: number;

  voterName: string;
  rollNo: string;

  gender: string;
  age: number;
  address: string;

  phone: string;

  aadharNumber: string;
  voterId: string;
  rationCardNumber: string;

  rentalHouse: string;
  houseOwnerName?: string;
  houseOwnerContact?: string;

  occupation: string;
  govtScheme: string;
  party: string;

  photo?: string;

  createdAt: string;

  category?: {
    id: number;
    name: string;
  };

  part?: {
    id: number;
    name: string;
  };

  ward?: {
    id: number;
    wardNo: string;
  };

  area?: {
    id: number;
    name: string;
  };
}


// ---------------- CREATE PAYLOAD ----------------

export interface CreateVoterPayload {
  category: number;
  partNo: number;
  wardNo: number;
  areaName: number;

  voterName: string;
  rollNo: string;

  gender: string;
  age: number;
  address: string;

  phone: string;

  aadharNumber: string;
  voterId: string;
  rationCardNumber: string;

  rentalHouse: string;
  houseOwnerName?: string;
  houseOwnerContact?: string;

  occupation: string;
  govtScheme: string;
  party: string;

  photo?: File;
}


// ---------------- UPDATE PAYLOAD ----------------

export type UpdateVoterPayload = Partial<CreateVoterPayload>;


// ---------------- CREATE RESPONSE ----------------

export interface CreateVoterResponse {
  message: string;
  voter: Voter;
}


// ---------------- PAGINATION RESPONSE ----------------

export interface VoterPaginationResponse {
  data: Voter[];

  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}