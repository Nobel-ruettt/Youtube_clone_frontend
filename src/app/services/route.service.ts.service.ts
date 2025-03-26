import { Injectable } from "@angular/core"
import { Router, NavigationEnd } from "@angular/router"
import { BehaviorSubject } from "rxjs"
import { filter } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class RouteService {
  private isStudioRoute = new BehaviorSubject<boolean>(false)
  isStudioRoute$ = this.isStudioRoute.asObservable()

  constructor(private router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
      const isStudio = event.url.includes("/studio")
      this.isStudioRoute.next(isStudio)
    })
  }
}

