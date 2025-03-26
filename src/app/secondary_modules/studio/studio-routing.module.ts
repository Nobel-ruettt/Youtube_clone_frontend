import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"

import { VideosComponent } from "./components/videos/videos.component"

const routes: Routes = [
  { path: "", redirectTo: "videos", pathMatch: "full" },
  { path: "videos", component: VideosComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudioRoutingModule {}

