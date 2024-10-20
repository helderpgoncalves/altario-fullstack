export interface Payment {
  id: string;
  name: string;
  amount: number;
  code: string;
  grid: string[][];
}

export interface GridData {
  grid: string[][];
  code: string;
  seconds: number;
}

export interface CreatePaymentData {
  name: string;
  amount: number;
  code: string;
  grid: string[][];
}
