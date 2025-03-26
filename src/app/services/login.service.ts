import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false)
  isLoggedIn$ = this._isLoggedIn.asObservable()

  constructor() {}

  login(): void {
    this._isLoggedIn.next(true)
  }

  logout(): void {
    this._isLoggedIn.next(false)
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn.value
  }
}

