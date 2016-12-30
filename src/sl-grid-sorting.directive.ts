import {Directive, Input, HostListener, ElementRef, Renderer} from '@angular/core';
import {SlGridDirective} from './sl-grid';
import {SortingOrder} from './sl-grid-sorting-order.enum';

@Directive({
  selector: 'th[slGridSorting]'
})
export class SlGridSortingDirective implements SlGridSortableColumn {
  @Input('slGridSorting') name: string;

  public sortOrder: SortingOrder;

  constructor(private el: ElementRef, private renderer: Renderer, private grid: SlGridDirective) {
    grid.registerSortableColumn(this);
    this.setSortOrder(null);
  }

  setSortOrder(newSortOrder: SortingOrder | null): void {
    if (newSortOrder !== this.sortOrder) {
      this.renderer.setElementClass(this.el.nativeElement, 'sorting_asc', newSortOrder === SortingOrder.Asc);
      this.renderer.setElementClass(this.el.nativeElement, 'sorting_desc', newSortOrder === SortingOrder.Desc);
      this.renderer.setElementClass(this.el.nativeElement, 'sorting', newSortOrder === null);
      this.sortOrder = newSortOrder;
    }
  }

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.preventDefault();
    switch (this.sortOrder) {
      case SortingOrder.Asc:
        this.setSortOrder(SortingOrder.Desc);
        break;
      case SortingOrder.Desc:
        this.setSortOrder(null);
        break;
      default:
        this.setSortOrder(SortingOrder.Asc);
        break;
    }
    this.grid.onSortChange(this);
  }
}

export interface SlGridSortableColumn {
  name: string;
  sortOrder: SortingOrder | null;
  setSortOrder(newSortOrder: SortingOrder): void;
}
