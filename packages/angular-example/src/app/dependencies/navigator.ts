import { Injectable } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Location } from '@angular/common'

export interface Navigator {
  open(path: string): Promise<void>
  close(): Promise<void>
  currentRoute: ActivatedRoute
}

@Injectable({
  providedIn: 'root',
})
export class AngularNavigator implements Navigator {
  constructor(
    currentRoute: ActivatedRoute,
    router: Router,
    location: Location,
  ) {
    this.currentRoute = currentRoute
    this.#router = router
    this.#location = location
  }

  currentRoute: ActivatedRoute

  async open(path: string) {
    this.#history.push(path)
    await this.#router.navigateByUrl(path)
  }

  async close() {
    if (this.#history.length > 0)
      await this.#location.back()
    else
      await this.open('')
  }

  #router
  #location
  #history: string[] = []
}
