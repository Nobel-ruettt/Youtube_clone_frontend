import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { WatchRoutingModule } from "./watch-routing.module"
import { SharedModule } from "../../shared/shared.module"
import { WatchPageComponent } from "./components/watch-page/watch-page.component"

@NgModule({
  declarations: [WatchPageComponent],
  imports: [CommonModule, FormsModule, WatchRoutingModule, SharedModule],
})
export class WatchModule {}
