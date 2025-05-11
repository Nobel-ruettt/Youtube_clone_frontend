import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { WatchPageComponent } from "./components/watch-page/watch-page.component"

const routes: Routes = [{ path: "", component: WatchPageComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WatchRoutingModule {}
