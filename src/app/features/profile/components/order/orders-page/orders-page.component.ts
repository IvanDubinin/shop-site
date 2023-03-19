import { Component, OnInit } from '@angular/core';

import { OrderService } from 'src/app/core/services/order.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { UserService } from 'src/app/core/services/user.service';
import { formatOptionsForDropDown } from 'src/app/helpers/formatOptionsForDropDown';

import { IOrder, IOrderFilterParams } from 'src/app/types/order.interfaces';
import { User } from 'src/app/types/user.model';
import { ISelect } from 'src/app/shared/components';
import { AutoUnsubscribeComponent } from 'src/app/helpers/AutoUnsubscribeComponent';

const orderStatusOptions = ['All', 'Waiting For Payment', 'Paid', 'Delivered', 'Cancelled'];
const yearOptions = ['All', '2022', '2021', '2020', 'Older'];

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss']
})
export class OrdersPageComponent extends AutoUnsubscribeComponent implements OnInit {
  constructor(
    private orderService: OrderService,
    private productService: ProductsService,
    private userService: UserService
  ) {
    super();
    this.user = this.userService.authorizedUser;
  }

  orders: IOrder[];
  user: User;

  filteredOrders: IOrder[] = [];
  filterYear: string = 'All';
  filterStatus: string = 'All';

  ordersForDropDown: ISelect[] = formatOptionsForDropDown(orderStatusOptions);
  yearsForDropDown: ISelect[] = formatOptionsForDropDown(yearOptions);

  ordersLoaded: boolean = false;
  filtersAreReseted: boolean = false;

  ngOnInit(): void {
    if (!this.user) {
      return;
    }
    const orderSubscription = this.orderService.getOrdersByUserId(this.user.id).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.ordersLoaded = true;
      }
    });
    this.addSubscription(orderSubscription);
  }

  onStatusChanged(status: string) {
    this.filterOrders({ status });
  }
  onYearChanged(year: string) {
    this.filterOrders({ year });
  }

  filterOrders(params: IOrderFilterParams) {
    const status = params.status || this.filterStatus;
    const year = params.year || this.filterYear;

    this.filterYear = year;
    this.filterStatus = status;

    //no filter
    if (status === 'All' && year === 'All') {
      this.filteredOrders = this.orders;
      return;
    }
    let filteredArray: IOrder[] = [];

    //by status
    if (status !== 'All') {
      const orderStatus =
        status === 'Waiting For Payment' ? 'WAITING_FOR_PAYMENT' : status?.toUpperCase();
      filteredArray = this.orders.filter((order) => order.status === orderStatus);
    }

    //by year
    if (year !== 'All') {
      const arrayToFilter = filteredArray.length ? filteredArray : this.orders;
      filteredArray = arrayToFilter.filter((order: IOrder) => {
        const date = new Date(order.createdAt);
        if (year === 'Older') {
          return date.getFullYear() <= 2019;
        }
        return date.getFullYear() === +year;
      });
    }
    this.filteredOrders = filteredArray;
  }

  resetFilters() {
    this.filtersAreReseted = true;
    setTimeout(() => (this.filtersAreReseted = false), 1000);
  }
}
