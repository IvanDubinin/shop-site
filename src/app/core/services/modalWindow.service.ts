import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UniversalModalWindowComponent } from 'src/app/shared/components/universal-modal-window/universal-modal-window.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModalWindowService {
  constructor(public dialog: MatDialog) {}

  modal(modalConfig: any) {
    let dialogRef = this.dialog.open(UniversalModalWindowComponent, modalConfig);
    return dialogRef.afterClosed();
  }
  modalLogout(modalConfig: any) {
    let dialogRef = this.dialog.open(UniversalModalWindowComponent, modalConfig);
    setTimeout(() => {
      dialogRef.close();
    }, environment.modalLogout);

    return dialogRef.afterClosed();
  }
}
