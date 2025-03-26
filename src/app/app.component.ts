import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { LoginService } from "./services/login.service"
import { Subscription } from "rxjs"
import { SidebarService } from "./services/sidebar.service.ts.service"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "youtube-clone"
  sidebarCollapsed = false
  isLoggedIn = false
  private subscription: Subscription = new Subscription()

  constructor(
    private sidebarService: SidebarService,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.sidebarService.sidebarCollapsed$.subscribe((collapsed) => {
        this.sidebarCollapsed = collapsed
      }),
    )

    this.subscription.add(
      this.loginService.isLoggedIn$.subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}

