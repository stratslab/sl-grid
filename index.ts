import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SlGridDirective} from "./src/sl-grid";
import {SlGridSortingDirective} from "./src/sl-grid-sorting.directive";

export * from './src/sl-grid';
export * from './src/sl-grid-sorting.directive';
export * from './src/sl-grid-sorting-order.enum';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SlGridDirective,
    SlGridSortingDirective
  ],
  exports: [
    SlGridDirective,
    SlGridSortingDirective
  ]
})
export class SlGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SlGridModule
    };
  }
}
