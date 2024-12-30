import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {OrderListPageComponent} from './app/pages/order-list-page';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
