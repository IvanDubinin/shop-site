import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/helpers/authentication-guard.service';
import { WishlistPageComponent } from './components';
import { ProfileDetailsPageComponent } from './components';
import { ProfilePageComponent } from './components';
import { AddressBookPageComponent, OrdersPageComponent } from './components';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: null
    },
    component: ProfilePageComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        data: {
          breadcrumb: null
        },
        component: ProfileDetailsPageComponent
      },
      {
        path: 'wishlist',
        data: {
          breadcrumb: 'Wishlist'
        },
        component: WishlistPageComponent
      },
      {
        path: 'orders',
        data: {
          breadcrumb: 'Orders'
        },
        component: OrdersPageComponent
      },
      {
        path: 'address-book',
        data: {
          breadcrumb: 'Address Book'
        },
        component: AddressBookPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
