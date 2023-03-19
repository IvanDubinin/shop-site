import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ProductsService } from 'src/app/core/services/products.service';
import { ICategory } from 'src/app/types/category.interface';
import { IHttpParams } from 'src/app/types/HttpParams.interface';
import { IProduct } from '../../../../types/product.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';

import {
  viewModes,
  DEFAULT_FILTER_OPTION,
  FILTER_OPTIONS,
  DEFAULT_PLP_IHTTP_PARAMS,
  FILTER_INDEXES,
  resizeThreshold
} from './product-list-page-constants';

@Component({
  selector: 'app-product-list-page',
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.scss']
})
export class ProductListPageComponent implements OnInit, AfterViewInit, OnDestroy {
  products: Array<IProduct>;
  categories$: Observable<ICategory[]>;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalCount: number;
  params: IHttpParams = { ...DEFAULT_PLP_IHTTP_PARAMS };
  filterOptions = {
    names: Object.keys(FILTER_OPTIONS),
    default: DEFAULT_FILTER_OPTION
  };
  viewMode: string = viewModes.list;
  productsSubscription: Subscription;
  productsAreLoaded: boolean = false;

  resizeListenerCb = () => {
    if (window.innerWidth <= resizeThreshold && this.viewMode === viewModes.bar) {
      this.viewMode = viewModes.list;
    }
  };

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    window.addEventListener('resize', this.resizeListenerCb);
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryMap: ParamMap) => {
      this.params = this.getParamsFromQueryParams(queryMap);
      this.filterOptions.default =
        FILTER_INDEXES[this.params.sort + this.params.order!] || DEFAULT_FILTER_OPTION;
      this.currentPage = this.convertToNumIfString(this.params.page!);
      this.getProducts(this.params);
    });
    this.categories$ = this.productsService.getCategories();
  }

  dataChangeHandler(viewModeObject: any) {
    this.viewMode = viewModeObject.value;
  }

  getProducts(params: IHttpParams) {
    this.productsSubscription = this.productsService.getProducts(params).subscribe((res) => {
      this.products = res.body!;
      this.totalCount = +res.headers.get('x-total-count')!;
      this.checkPagesLimit();
    });
  }

  onCategoryChanged(newSelection: MatSelectChange) {
    const category = newSelection.value;
    this.params.category = category;
    this.setPageProps(1, 1);
    this.makeNavigation();
  }

  onFilterChanged(selecteFilter: MatSelectChange) {
    const filter = selecteFilter.value;
    const newFilter = FILTER_OPTIONS[filter] || FILTER_OPTIONS[DEFAULT_FILTER_OPTION];
    this.params = { ...this.params, ...newFilter, page: 1 };
    this.makeNavigation();
  }

  onSearchChanged() {
    this.setPageProps(1, 1);
    this.makeNavigation();
  }

  onPageChanged(currentP: number): void {
    const totalPages = this.getPageAmount();
    if (currentP > totalPages || currentP < 1) {
      return;
    }
    this.setPageProps(currentP, currentP);
    this.makeNavigation();
  }

  setPageProps(paramsPage: number, currentPage: number | null = null) {
    this.params.page = paramsPage;
    this.currentPage = currentPage || this.currentPage;
  }

  getParamsFromQueryParams(queryMap: ParamMap): IHttpParams {
    const newHttpParams: IHttpParams = {};
    let param: keyof IHttpParams;
    for (param in this.params) {
      const currentQueryParam = queryMap.get(param);
      switch (param) {
        case 'userId':
        case 'productId':
        case 'id':
          newHttpParams[param] = currentQueryParam !== null ? +currentQueryParam : undefined;
          break;
        default:
          newHttpParams[param] = currentQueryParam || '';
      }
    }
    return newHttpParams;
  }

  convertToNumIfString(input: string | number): number {
    if (typeof input === 'string') {
      return Number(input);
    }
    return input;
  }

  checkPagesLimit() {
    if (Number(this.params.page!) > this.getPageAmount()) {
      this.setPageProps(1, 1);
    }
  }

  makeNavigation() {
    this.router.navigate(['home/products'], { queryParams: { ...this.params } });
    this.productsAreLoaded = true;
  }

  getPageAmount(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }

  resetFilters() {
    this.params = { ...DEFAULT_PLP_IHTTP_PARAMS };
    this.makeNavigation();
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
    window.removeEventListener('resize', this.resizeListenerCb);
  }
}
