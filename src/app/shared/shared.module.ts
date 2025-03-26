import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { HeaderComponent } from "../components/header/header.component"
import { SidebarComponent } from "../components/sidebar/sidebar.component"

@NgModule({
  declarations: [HeaderComponent, SidebarComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [HeaderComponent, SidebarComponent, CommonModule, RouterModule, FormsModule],
})
export class SharedModule {}

