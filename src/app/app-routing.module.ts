import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProductListPageComponent } from './features/product/components';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PageNotFoundComponent } from './shared/components';

const routes: Routes = [
  {
    path: 'home',
    data: {
      breadcrumb: 'Home'
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: null
        },
        component: HomePageComponent
      },
      {
        path: 'products',
        data: {
          breadcrumb: 'Products'
        },
        component: ProductListPageComponent
      },
      {
        path: 'cart',
        data: {
          breadcrumb: 'Cart'
        },
        loadChildren: () => import('./features/cart/cart.module').then((m) => m.CartModule)
      },
      {
        path: 'checkout',
        data: {
          breadcrumb: 'Checkout'
        },
        loadChildren: () =>
          import('./features/checkout/checkout.module').then((m) => m.CheckoutModule)
      },
      {
        path: 'profile',
        data: {
          breadcrumb: 'Profile'
        },
        loadChildren: () => import('./features/profile/profile.module').then((m) => m.ProfileModule)
      },
      {
        path: 'products/:productId',
        data: {
          breadcrumb: null
        },
        loadChildren: () =>
          import('./features/product-details/product-details.module').then(
            (m) => m.ProductDetailsModule
          )
      }
    ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

const extraOptions: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  enableTracing: false // Makes the router log all its internal events to the console.
};
@NgModule({
  imports: [RouterModule.forRoot(routes, extraOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
