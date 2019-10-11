import { Directive, ElementRef, HostListener } from '@angular/core';
import { CurrencyPipePipe } from '../pipes/currency-pipe.pipe';

@Directive({
  selector: '[appCurrencyFormatter]'
})
export class CurrencyFormatterDirective {

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private currencyPipe: CurrencyPipePipe
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = this.currencyPipe.parse(this.el.value);
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.el.value = this.currencyPipe.parse(value); // opossite of transform
    // console.log('Value Focus',this.el.value);
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    this.el.value = this.currencyPipe.parse(value);
    // console.log('Value blur',this.el.value.length);
    if(this.el.value.length == 0) {
      this.el.value = '';
    }
  }

  @HostListener("keyup", ["$event.target.value"]) 
  onKeyUp(value) {
    this.el.value = this.currencyPipe.parse(value);
    // console.log('Value keyup',this.el.value);
  }


}
