export interface Metrics {
  userCount: number;
  tvl: number;
  amountDeposited: number;
}
export interface leveragePosition {
  positionId: string;
  amountDepositedInUsd: number;
  amountReturnedInUsd: number;
  open: boolean;
  // collateralToken:String,
  // loanToken:String,
}
