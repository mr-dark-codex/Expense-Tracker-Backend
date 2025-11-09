export interface CreateTransactionDto {
  amount: number;
  modeid: string;
  categoryid?: string;
  transactiontype: "CREDIT" | "DEBIT";
  description?: string;
  transactiondate?: Date;
}

export interface UpdateTransactionDto {
  amount?: number;
  modeid?: string;
  categoryid?: string;
  transactiontype?: "CREDIT" | "DEBIT";
  description?: string;
  transactiondate?: Date;
}
