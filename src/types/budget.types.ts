export interface CreateBudgetDto {
  amount?: number;
  startdate?: string;
  enddate?: string;
}

export interface UpdateBudgetDto {
  amount?: number;
  startdate?: string;
  enddate?: string;
}

export interface GetBudgetsFilterDto {
  startdate?: string;
  enddate?: string;
}
