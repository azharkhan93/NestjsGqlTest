export interface ICreateItemDto {
  name: string;
  description?: string;
}

export interface IUpdateItemDto {
  id: string;
  name?: string;
  description?: string;
}
