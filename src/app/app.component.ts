import { Component, OnInit, OnDestroy } from "@angular/core"
import { Router, NavigationEnd } from "@angular/router"
import { filter } from "rxjs/operators"
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
  isWatchPage = false
  private subscription: Subscription = new Subscription()

  constructor(
    private sidebarService: SidebarService,
    private loginService: LoginService,
    private router: Router,
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

    // Check if we're on the watch page
    this.subscription.add(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
        this.isWatchPage = event.url.includes("/watch/")
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
