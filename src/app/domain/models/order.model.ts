export interface Order {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  status: 'pending' | 'approved';
}