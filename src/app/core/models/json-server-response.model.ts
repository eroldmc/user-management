export class JsonServerResponse<T> {
    first: number;
    prev: number | null;
    next: number | null;
    last: number;
    pages: number;
    items: number;
    data: T[];
  
    constructor(response?: Partial<JsonServerResponse<T>>) {
      this.first = response?.first ?? 1;
      this.prev = response?.prev ?? null;
      this.next = response?.next ?? null;
      this.last = response?.last ?? 1;
      this.pages = response?.pages ?? 1;
      this.items = response?.items ?? 0;
      this.data = response?.data ?? [];
    }
  }
  