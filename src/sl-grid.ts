import {Directive, Input} from '@angular/core';
import {SlGridSortableColumn} from './sl-grid-sorting.directive';
import {SortingOrder} from './sl-grid-sorting-order.enum';

@Directive({
  selector: 'sl-grid',
  exportAs: 'sl-grid'
})

export class SlGridDirective implements ISlGrid {
  @Input('source-rows') set setSourceRows(sourceRows: Array<any>) {
    this.sourceRows = sourceRows;
    this.updateSortedRows();
    this.updateRowsForPage();
  };

  // All source rows
  private sourceRows: Array<any>;

  // Registered sortable columns
  private sortableColumns: Array<SlGridSortableColumn>;

  // Source rows sorted
  private sortedRows: Array<any>;

  // Sorted rows sliced to page size
  public rowsForPage: Array<any>;

  public pagination = {
    page: 1,
    itemsPerPage: 10,
    length: 0
  };

  private columnUsedForSorting: SlGridSortableColumn | null;

  constructor() {
    this.sortableColumns = [];
    this.columnUsedForSorting = null;
  }

  public registerSortableColumn(column: SlGridSortableColumn) {
    this.sortableColumns.push(column);
  }

  public onSortChange(column: SlGridSortableColumn): void {
    this.sortableColumns.forEach((col: SlGridSortableColumn) => {
      if (col.name !== column.name) {
        col.setSortOrder(null);
      }
    });
    this.columnUsedForSorting = column.sortOrder !== null ? column : null;
    this.updateSortedRows();
    this.updateRowsForPage();
  }

  public onChangePage(pageEvent: {page: number, itemsPerPage: number}): void {
    this.pagination.page = pageEvent.page;
    this.pagination.itemsPerPage = pageEvent.itemsPerPage;

    this.updateRowsForPage();
  }

  private updateSortedRows(): void {
    let getNestedValue = (obj: any, path: string) => {
      const value = path.split(".").reduce((acc, part) => acc && acc[part], obj);
      return value === undefined ? null : value;
    };

    if (this.columnUsedForSorting) {
      const column = this.columnUsedForSorting
      this.sortedRows = this.sourceRows.slice().sort((a, b) => {
        let compareResult = 0;
        if (getNestedValue(a, column.name) < getNestedValue(b, column.name)) {
          compareResult = -1;
        } else if (getNestedValue(a, column.name) > getNestedValue(b, column.name)) {
          compareResult = 1;
        }

        if (column.sortOrder === SortingOrder.Desc) {
          compareResult = compareResult * -1;
        }
        return compareResult;
      });
    } else {
      this.sortedRows = this.sourceRows;
    }
  }

  private updateRowsForPage(): void {
    let start = (this.pagination.page - 1) * this.pagination.itemsPerPage;
    let end = this.pagination.itemsPerPage > -1 ? (start + this.pagination.itemsPerPage) : this.sortedRows.length;

    this.rowsForPage = this.sortedRows.slice(start, end);
    this.pagination.length = this.sortedRows.length;
  }
}

// SlGrid public interface
export interface ISlGrid {
  // Sorted rows sliced to page size
  rowsForPage: Array<any>;

  // Information for pagination
  pagination: {
    page: number,
    // TODO: Currently -1 allows disabling pagination, find better way of doing it
    itemsPerPage: number,
    length: number
  };

  // Callback for change page event
  onChangePage(pageEvent: {page: number, itemsPerPage: number}): void;
}
