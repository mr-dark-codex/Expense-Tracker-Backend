export interface CreateTransactionModeDto {
  modename: string;
  amount?: number;
  currency?: string;
  description?: string;
}

export interface UpdateTransactionModeDto {
  modename?: string;
  amount?: number;
  currency?: string;
  description?: string;
}
