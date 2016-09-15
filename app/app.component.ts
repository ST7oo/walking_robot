import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    directives: [ROUTER_DIRECTIVES],
    selector: 'my-app',
    template: `
<h1>Walking Robot</h1>
<a [routerLink]="['/']">Home</a> | <a [routerLink]="['/about/', { id: 2 }]">About</a>
<router-outlet></router-outlet>
`,
})
export class AppComponent {

    constructor() {}
}
