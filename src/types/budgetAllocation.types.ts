export interface CreateBudgetAllocationDto {
  budgetid: string;
  categoryid: string;
  allocatedamount?: number;
  description?: string;
}

export interface UpdateBudgetAllocationDto {
  budgetid?: string;
  categoryid?: string;
  allocatedamount?: number;
  description?: string;
}
