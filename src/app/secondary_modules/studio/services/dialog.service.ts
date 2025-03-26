import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class DialogService {
  private dialogOpenSubject = new BehaviorSubject<boolean>(false)
  dialogOpen$ = this.dialogOpenSubject.asObservable()

  constructor() {}

  openDialog(): void {
    this.dialogOpenSubject.next(true)
  }

  closeDialog(): void {
    this.dialogOpenSubject.next(false)
  }
}

