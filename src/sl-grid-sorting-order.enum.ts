export enum SortingOrder {
  Asc,
  Desc
}

export namespace SortingOrder {
  export function getSortingOrderLabel(sortingOrder: SortingOrder | null): string | null {
    switch (sortingOrder) {
      case SortingOrder.Asc:
        return 'asc';
      case SortingOrder.Desc:
        return 'desc';
      default:
        return null;
    }
  }
}
