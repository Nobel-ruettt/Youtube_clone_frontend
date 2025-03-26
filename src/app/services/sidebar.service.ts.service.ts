import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class SidebarService {
  private _sidebarCollapsed = new BehaviorSubject<boolean>(false)
  sidebarCollapsed$ = this._sidebarCollapsed.asObservable()

  constructor() {}

  toggleSidebar(): void {
    this._sidebarCollapsed.next(!this._sidebarCollapsed.value)
  }

  setSidebarState(collapsed: boolean): void {
    this._sidebarCollapsed.next(collapsed)
  }

  get sidebarCollapsed(): boolean {
    return this._sidebarCollapsed.value
  }
}

