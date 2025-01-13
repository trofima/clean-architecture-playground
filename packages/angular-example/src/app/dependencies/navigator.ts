import { Router, RouterModule } from "@angular/router";

export class AppNavigator {
  // router = new AppRoutingModule
  
  constructor(private router: Router) {
    this.#router = router
    // console.log('this.#router', this.#router)
    // console.log('this.#router.routerState', this.#router.routerState)
    // console.log('this.#router.routerState', this.#router.routerState)
    // this.#history.push(this.#router.routerState.snapshot)
  }
  
  open = (path: string) => {
    return this.#router.navigate([path]);
  }

  // open(path) {
  //   this.#router.navigate(path)
  //   this.#history.push(path)
  // }

  close = () => {
    return this.#router.navigate(['']);
  }
  // close() {
  //   if (this.#history.length > 1) this.#router.navigate(-1)
  //   else this.open('/')
  // }

  #history: any
  #router
}

export const appNavigator = new AppNavigator(new Router())