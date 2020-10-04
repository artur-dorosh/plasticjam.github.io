export interface IPagination {
  page: number;
  range: number;
}

export const defaultPagination: IPagination = {
  page: 0,
  range: 5,
};
