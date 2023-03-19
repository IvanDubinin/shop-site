import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { buildParamsObject } from 'src/app/helpers/buildParamsObject';
import { IOrder } from 'src/app/types/order.interfaces';
import { IHttpParams } from 'src/app/types/HttpParams.interface';
import { UserService } from './user.service';
import { IUser } from '../../types/user.interface';
import { Router } from '@angular/router';

const BACK_URL: string = `${environment.apiUrl}/orders`;

@Injectable({ providedIn: 'root' })
export class OrderService {
  user: IUser | null;

  constructor(private http: HttpClient, private userService: UserService, private router: Router) {
    this.user = this.userService.getUser().getValue();
  }

  createIntermediateOrder(order: IOrder) {
    if (this.user) {
      this.createOrder(order).subscribe({
        next: (order) => {
          this.router.navigate(['home/checkout', { orderId: order.id }]);
        },
        error: (e) => console.error(e)
      });
    } else {
      sessionStorage.setItem('anonymousOrder', JSON.stringify(order));
      this.router.navigate(['home/checkout']);
    }
  }

  createOrder(order: IOrder): Observable<IOrder> {
    const orderWithDates: IOrder = {
      ...order,
      updatedAt: Date.now(),
      deliveredAt: null
    };

    return this.http.post<IOrder>(BACK_URL, orderWithDates, {
      headers: { 'Content-Type': 'application/json' },
      observe: 'body'
    });
  }

  updateOrder(order: IOrder): Observable<IOrder> {
    const updatedOrder: IOrder = {
      ...order,
      updatedAt: Date.now(),
      deliveredAt: order.status === 'DELIVERED' ? Date.now() : null
    };
    return this.http.put<IOrder>(`${BACK_URL}/${order.id}`, updatedOrder);
  }

  getOrders(params: IHttpParams = {}): Observable<IOrder[]> {
    const httpParams = new HttpParams({
      fromObject: buildParamsObject(params)
    });
    return this.http
      .get<IOrder[]>(BACK_URL, {
        params: httpParams,
        observe: 'response'
      })
      .pipe(map((httpResponse) => httpResponse.body!));
  }

  getOrdersByUserId(userId: number): Observable<IOrder[]> {
    const params: IHttpParams = {
      userId: userId,
      sort: 'createdAt',
      order: 'desc'
    };
    return this.getOrders(params);
  }
}
