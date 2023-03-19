import { HttpHeaders } from '@angular/common/http';
import { IProduct } from './product.model';

//TODO: to delete during EPMLSTRJA-67 task
export interface ITempHttpRespMock {
  body: Array<IProduct>;
  headers: HttpHeaders;
}
