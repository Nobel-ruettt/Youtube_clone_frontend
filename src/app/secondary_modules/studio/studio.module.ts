import { NgModule } from "@angular/core"

import { StudioRoutingModule } from "./studio-routing.module"
import { SharedModule } from "../../shared/shared.module"
import { VideosComponent } from "./components/videos/videos.component";
import { UploadDialogComponent } from './components/upload-dialog/upload-dialog.component'
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [VideosComponent, UploadDialogComponent],
  imports: [SharedModule, StudioRoutingModule,ReactiveFormsModule],
})
export class StudioModule {}

