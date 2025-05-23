import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { HomeComponent } from "./home/home.component"
import { SharedModule } from "./shared/shared.module"

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, HttpClientModule, SharedModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
