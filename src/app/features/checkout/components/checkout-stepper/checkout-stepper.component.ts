import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { IUser } from '../../../../types/user.interface';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { IOrder } from '../../../../types/order.interfaces';
import { LoggingService } from '../../../../core/services/logging-service';
import {
  LocationAndName,
  PaymentInfo,
  PersonalInformation
} from '../../../../types/checkoutSteps.interface';
import { generatePassword } from '../../../../helpers/passwordGenerator';
import { LocationOnly } from '../delivery-address-step/delivery-address-step.component';

@Component({
  selector: 'app-checkout-stepper',
  templateUrl: './checkout-stepper.component.html',
  styleUrls: ['./checkout-stepper.component.scss']
})
export class CheckoutStepperComponent implements OnInit {
  step = 0;
  lastUnblockedStep = 0;

  user: IUser | null;
  personalInfo: PersonalInformation;
  addressInfo: LocationAndName | null;
  paymentInfo: PaymentInfo;
  orderId: number;
  order: IOrder;
  orderPrice: number;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private loggingService: LoggingService
  ) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));

    this.step = this.user ? 1 : 0;
    this.lastUnblockedStep = this.step;

    if (this.user) {
      this.orderService.getOrders({ id: this.orderId }).subscribe((resp) => {
        this.order = resp[0];
        this.orderPrice = +this.order?.totalPrice.toFixed(2);
      });
      this.personalInfo = { ...this.user };
    } else {
      this.order = JSON.parse(sessionStorage.getItem('anonymousOrder') as string);
      this.orderPrice = +this.order?.totalPrice.toFixed(2);
    }
  }

  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    if (this.lastUnblockedStep < this.step + 1) this.lastUnblockedStep++;
    this.step++;
  }
  prevStep() {
    this.step--;
  }

  handlePersonalInformation(formData: PersonalInformation) {
    this.personalInfo = formData;
    this.nextStep();
    console.log(this.personalInfo);
  }

  handleAddressInformation(formData: LocationOnly) {
    console.log(this.orderPrice);
    this.addressInfo = formData;
    this.addressInfo.title = this.personalInfo.title;
    this.addressInfo.name = this.personalInfo.firstName;
    this.addressInfo.surname = this.personalInfo.lastName;
    this.order!.deliveryAddress = this.addressInfo;
    this.nextStep();
  }

  handlePayment(formData: PaymentInfo) {
    this.paymentInfo = formData;
    this.order.status = 'PAID';
    if (!this.user) {
      this.userService
        .register({
          firstName: this.personalInfo.firstName,
          lastName: this.personalInfo.lastName,
          email: this.personalInfo.email,
          password: generatePassword(8),
          role: 'consumer'
        })
        .subscribe({
          next: (user) => {
            this.user = user;
            this.order.userId = user.id;
            this.orderService.createOrder(this.order).subscribe({
              next: () => {
                this.confirmPayment();
              },
              error: (e) => {
                console.error(e);
              }
            });
            this.loggingService.logBusinessAction({
              message: `
                    User has been created
                    Login: ${user.email}
                    Password: ${user.password}
                    `,
              title: 'Success',
              isKeptOpen: true
            });
          },
          error: (e) => {
            console.error(e);
          }
        });
    } else {
      this.orderService.updateOrder(this.order).subscribe({
        next: () => {
          this.confirmPayment();
        },
        error: (e) => {
          console.error(e);
        }
      });
    }
  }

  confirmPayment() {
    this.user!.spentMoney = this.user!.spentMoney
      ? this.user!.spentMoney + this.orderPrice
      : this.orderPrice;
    this.userService.updateUser(this.user!).subscribe(() => {});
    this.loggingService.logBusinessAction({
      message: `
                    Order paid
                    `,
      title: 'Success'
    });
    sessionStorage.removeItem('anonymousOrder');
    this.nextStep();
  }
}
