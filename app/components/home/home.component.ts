import { Component, OnInit } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import * as math from 'mathjs';


@Component({
    selector: 'my-home',
    templateUrl: 'components/home/home.component.html',
    styleUrls: ['components/home/home.component.css']
})
export class HomeComponent implements OnInit {
    name: string = "Home page";
    users: {};
		arr: number;

    constructor(http: Http) {
        http.get("/users")
            .map(data => data.json())
            .subscribe((data) => this.users = data);
    }

		ngOnInit() {
			this.arr = math.randomInt(5);
			console.log(this.arr);
			
		}
}