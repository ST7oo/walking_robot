import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
	directives: [ROUTER_DIRECTIVES],
	selector: 'my-app',
	template: `
	<h1 class="title">
	Walking Robot <a [routerLink]="['/about']"><i class="glyphicon glyphicon-info-sign"></i></a>
	</h1>
	<router-outlet></router-outlet>
	`
})
export class AppComponent { }
