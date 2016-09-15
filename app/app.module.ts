import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
// import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { AboutComponent } from "./components/about/about.component";
import { routing } from "./routes";
import { HomeComponent } from "./components/home/home.component";

@NgModule({
    imports: [
        BrowserModule,
        // HttpModule,
        // JsonpModule,
        routing,
				FormsModule
    ],
    declarations: [
        AppComponent,
        AboutComponent,
        HomeComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
