import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsPageComponent } from './components';
import { ProductNameToBreadcrumbsResolver } from './components/product-details-page/product-details-page.component.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: {
      product: ProductNameToBreadcrumbsResolver
    },
    component: ProductDetailsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductDetailsRoutingModule {}
