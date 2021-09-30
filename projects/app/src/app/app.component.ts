import { Component, ViewEncapsulation } from '@angular/core';
import { AngularAppHintsService } from 'angular-app-hints';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  constructor(
    private hintService: AngularAppHintsService,
  ) { }

  public start(): void {
    this.hintService.setPath([{
      selector: '.row:nth-of-type(1) .block:nth-of-type(1)',
      message: '<b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit elementum eleifend. Curabitur eleifend, ligula ac suscipit imperdiet, ex sapien varius risus, at tempus ipsum elit et tortor.',
      style: {
        padding: 6,
        borderRadius: 3,
      }
    }, {
      selector: '.row:nth-of-type(1) .block:nth-of-type(10)',
      message: 'Donec viverra neque libero, nec vestibulum quam egestas vel. Quisque tempor arcu nec rutrum ultricies. Nulla iaculis malesuada pretium. Nunc luctus tempor elit, in feugiat quam elementum eu. Praesent purus urna, commodo quis ligula et, lobortis scelerisque nisi. Donec vitae sem tellus.',
      disableClose: true,
      style: {
        padding: 6,
        borderRadius: 3,
      }
    }, {
      selector: '.row:nth-of-type(10) .block:nth-of-type(1)',
      message: 'Donec viverra neque libero, nec vestibulum quam egestas vel. Quisque tempor arcu nec rutrum ultricies. Nulla iaculis malesuada pretium. Nunc luctus tempor elit, in feugiat quam elementum eu. Praesent purus urna, commodo quis ligula et, lobortis scelerisque nisi. Donec vitae sem tellus.',
      disableClose: true,
      style: {
        padding: 6,
        borderRadius: 3,
      }
    }, {
      selector: '.row:nth-of-type(10) .block:nth-of-type(10)',
      message: 'Donec viverra neque libero, nec vestibulum quam egestas vel. Quisque tempor arcu nec rutrum ultricies. Nulla iaculis malesuada pretium. Nunc luctus tempor elit, in feugiat quam elementum eu. Praesent purus urna, commodo quis ligula et, lobortis scelerisque nisi. Donec vitae sem tellus.',
      style: {
        padding: 6,
        borderRadius: 3,
      }
    }, {
      selector: '.row:nth-of-type(1) .block:nth-of-type(1)',
      message: 'Donec viverra neque libero, nec vestibulum quam egestas vel. Quisque tempor arcu nec rutrum ultricies. Nulla iaculis malesuada pretium. Nunc luctus tempor elit, in feugiat quam elementum eu. Praesent purus urna, commodo quis ligula et, lobortis scelerisque nisi. Donec vitae sem tellus.',
      style: {
        padding: 6,
        borderRadius: 3,
      }
    }]);
    this.hintService.go();
  }
}
