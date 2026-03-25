export interface Category {
  id: number;
  name: string;
}

export interface Part {
  id: number;
  name: string;
}

export interface Ward {
  id: number;
  wardNo: string;
}

export interface Area {
  id: number;
  name: string;
}

export interface Voter {
  id: number;

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

  category: Category;
  part: Part;
  ward: Ward;
  area: Area;
}

export interface Pagination {
  totalRecords: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VoterPaginationResponse {
  search: boolean;
  data: Voter[];
  pagination?: Pagination;
  total?: number;
}