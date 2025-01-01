import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderListPageComponent } from './pages/order-list-page';
import { OrderComponent } from './pages/order/order.component';

export const routes: Routes = [
  { path: '', component: OrderListPageComponent },
  { path: 'order', component: OrderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }