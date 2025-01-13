import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderListPageComponent } from './pages/order-list-page';
import { OrderPageComponent } from './pages/order-page';

export const routes: Routes = [
  { path: '', component: OrderListPageComponent },
  { path: 'order', component: OrderPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }