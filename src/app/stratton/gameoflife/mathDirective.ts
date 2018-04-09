/* tslint:disable:directive-selector */
import { Directive } from '@angular/core';
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[globalMath]',
  exportAs: 'Math'
})
export class MathDirective {
  constructor() { return Math; }
}
