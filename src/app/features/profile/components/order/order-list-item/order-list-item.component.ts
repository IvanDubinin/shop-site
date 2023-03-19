import { Component, Input, OnInit } from '@angular/core';
import { OrderService } from 'src/app/core/services/order.service';
import { IOrder, orderStatus } from 'src/app/types/order.interfaces';
import { ProductsService } from 'src/app/core/services/products.service';
import { ModalWindowService } from 'src/app/core/services/modalWindow.service';
// import { OrderService } from '../../../../core/services/order.service';
// import { IOrder, orderStatus } from '../../../../types/order.interfaces';
// import { ProductsService } from '../../../../core/services/products.service';
// import { ModalWindowService } from '../../../../core/services/modalWindow.service';
import { Router } from '@angular/router';

const COLOR_GRAY = '#9d9d9d';
const COLOR_GREEN = '#00bd55';

@Component({
  selector: 'app-order-list-item',
  templateUrl: './order-list-item.component.html',
  styleUrls: ['./order-list-item.component.scss']
})
export class OrderListItemComponent implements OnInit {
  arrayOfImages: Array<string>;
  @Input() order: IOrder;
  @Input() expanded: boolean;
  buttonStatus: string;
  modalConfig = {
    data: {
      title: 'Confirmation',
      content: '',
      buttonOK: 'YES',
      buttonNG: 'NO',
      autoFocus: '[name=closeNo]'
    },
    width: '500px',
    panelClass: 'dialog'
  };

  constructor(
    public orderService: OrderService,
    private productService: ProductsService,
    private modalWindowService: ModalWindowService,
    private router: Router
  ) {}
  ngOnInit() {
    const arrayOfPictures: string[] = [];
    this.order.products.forEach((product) => {
      this.productService.getProductById(product.originalProductId).subscribe((productDetails) => {
        arrayOfPictures.push(productDetails.images[0]);
      });
    });
    this.arrayOfImages = arrayOfPictures;
  }

  changeButtonVersion(status: orderStatus) {
    if (status === 'WAITING_FOR_PAYMENT') {
      return 'Cancel Order'.toUpperCase();
    } else if (status == 'PAID') {
      return 'Confirm Delivery'.toUpperCase();
    }
    return;
  }
  changeStyle(status: orderStatus) {
    return status === 'DELIVERED' || status === 'CANCELLED' ? COLOR_GRAY : COLOR_GREEN;
  }
  openDialog(content: string) {
    this.modalConfig.data.content = content;
    this.modalWindowService.modal(this.modalConfig).subscribe({
      next: (data) => {
        // CHECK IF DATA === TRUE, BECAUSE MODAL() RETURNS STRING, AND 'FALSE' STRING IS TRUTHY
        if (data === 'true') {
          if (this.order.status === 'WAITING_FOR_PAYMENT') {
            this.order.status = 'CANCELLED';
          } else if (this.order.status === 'PAID') {
            this.order.status = 'DELIVERED';
          }
          this.orderService.updateOrder(this.order).subscribe(() => {});
        }
      },
      error: (err) => console.log(err)
    });
  }
  handleStatus(status: orderStatus) {
    if (status === 'WAITING_FOR_PAYMENT') {
      this.openDialog('Are you sure you want to cancel order?');
    } else if (status == 'PAID') {
      this.openDialog('Are you sure you want to confirm delivery?');
    }
  }

  confirmPayment() {
    this.router.navigate(['home/checkout', { orderId: this.order.id }]);
  }
}
