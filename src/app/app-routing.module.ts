import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "studio", loadChildren: () => import("./secondary_modules/studio/studio.module").then((m) => m.StudioModule) },
  {
    path: "watch/:id",
    loadChildren: () => import("./secondary_modules/watch/watch.module").then((m) => m.WatchModule),
  },
  { path: "**", redirectTo: "home" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
