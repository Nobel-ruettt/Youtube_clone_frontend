import { Component, OnInit, HostListener, ElementRef } from "@angular/core"


import { RouteService } from "../../services/route.service.ts.service"
import { SidebarService } from "../../services/sidebar.service.ts.service"
import { LoginService } from "../../services/login.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isSearchFocused = false
  searchQuery = ""
  isLoggedIn = false
  isDropdownOpen = false
  isStudioRoute = false

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private routeService: RouteService,
    private sidebarService: SidebarService,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.routeService.isStudioRoute$.subscribe((isStudio) => {
      this.isStudioRoute = isStudio
    })

    this.loginService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn
    })
  }

  onSearchFocus(): void {
    this.isSearchFocused = true
  }

  onSearchBlur(): void {
    this.isSearchFocused = false
  }

  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      console.log("Search for:", this.searchQuery)
    }
  }

  toggleMobileSearch(): void {
    console.log("Toggle mobile search")
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation()
    this.isDropdownOpen = !this.isDropdownOpen
  }

  onMenuClick(): void {
    this.sidebarService.toggleSidebar()
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target)
    if (!clickedInside) {
      this.isDropdownOpen = false
    }
  }

  login(): void {
    console.log("Login clicked")
    this.loginService.login()
  }

  signup(): void {
    console.log("Signup clicked")
  }

  logout(): void {
    console.log("Logout clicked")
    this.loginService.logout()
    this.isDropdownOpen = false

    // If in studio mode, redirect to home page
    if (this.isStudioRoute) {
      this.router.navigate(["/home"])
    }
  }
}


