import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderListPage } from './order-list';
import { OrderPage } from './order';

export const routes: Routes = [
  { path: '', component: OrderListPage },
  { path: 'order', component: OrderPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }