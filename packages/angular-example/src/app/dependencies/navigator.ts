import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { Location } from '@angular/common'

export interface Navigator {
  open(path: string): Promise<void>
  close(): Promise<void>
}

@Injectable({
  providedIn: 'root',
})
export class AngularNavigator implements Navigator {
  constructor(
    router: Router,
    location: Location,
  ) {
    this.#router = router
    this.#location = location
  }

  async open(path: string) {
     await this.#router.navigateByUrl(path)
  }

  async close() {
    if (this.#location.path().length)
      await this.#location.back()
    else
      await this.open('')
  }

  #router
  #location
}
