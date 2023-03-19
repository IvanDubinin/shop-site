import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCartPageComponent } from './components/shopping-cart-page/shopping-cart-page.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: null
    },
    component: ShoppingCartPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule {}
