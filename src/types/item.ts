interface ItemsResponse {
  id: string;
  title: string;
  type: 1 | -1;
  amount: number;
  description?: string;
  time: Date;
}
interface CreateItemBody {
  title: string;
  type: 1 | -1;
  amount: number;
  description?: string;
  time?: Date;
}
