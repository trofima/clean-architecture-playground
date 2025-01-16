import { inject, Injectable } from "@angular/core"
import { Router, RouterModule } from "@angular/router"
import { Location } from '@angular/common'

export class AppNavigator {
  
  router = inject(Router)
  location = inject(Location)
  
  open(path: string) {
    return this.router.navigateByUrl(path)
  }

  close() {
    if (this.location.path().length)
      return this.location.back()
    else
      return this.open('')
  }
}
