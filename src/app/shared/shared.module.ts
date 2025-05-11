import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { HeaderComponent } from "../components/header/header.component"
import { SidebarComponent } from "../components/sidebar/sidebar.component"
import { VideoPlayerComponent } from "./components/video-player/video-player.component"


@NgModule({
  declarations: [HeaderComponent, SidebarComponent, VideoPlayerComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [HeaderComponent, SidebarComponent, VideoPlayerComponent, CommonModule, RouterModule, FormsModule],
})
export class SharedModule {}
