import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule, routes } from './app-routing.module';

// Import your components
import { AppComponent } from './app.component';
import { OrderListPageComponent } from './pages/order-list-page';
import { OrderPageComponent } from './pages/order-page';

@NgModule({
  declarations: [
    AppComponent,
    OrderListPageComponent,
    OrderPageComponent
  ],
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      scrollPositionRestoration: 'disabled',
    }),
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}