import { Component, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UserService } from 'src/app/core/services/user.service';
import { IUser } from 'src/app/types/user.interface';
import { AutoUnsubscribeComponent } from 'src/app/helpers/AutoUnsubscribeComponent';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent extends AutoUnsubscribeComponent {
  @Input() user: IUser | null;

  uploadedImgUrl: string | null;
  imageChangedEvent: any = null;
  croppedImage: any = null;
  isBeingCropped: boolean = false;

  constructor(private userService: UserService) {
    super();
  }

  fileChangeEvent(event: any): void {
    if (!this.userIsConsumer()) {
      return;
    }
    this.imageChangedEvent = event;
    this.isBeingCropped = true;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  isInPreviewMode() {
    return this.isBeingCropped;
  }

  cancelCropping() {
    this.isBeingCropped = false;
  }

  uploadFiles(): void {
    if (this.croppedImage) {
      this.upload(this.croppedImage);
    }
    this.croppedImage = null;
    this.isBeingCropped = false;
  }

  upload(file: File): void {
    if (!file) {
      return;
    }
    const uploadImageSubscription = this.userService.updateUserAvatar(file).subscribe({
      next: (res) => {
        if (this.user) {
          const updateUserSubscription = this.userService
            .updateUser({ ...this.user, picture: res.url })
            .subscribe(() => {
              this.uploadedImgUrl = res.url;
              this.userService.showSuccessMessage("User's avatar's been successfully updated");
            });
          this.addSubscription(updateUserSubscription);
        }
      },
      error: () => {
        this.userService.showAndThrowError("Avatar wasn't updated. Try again later");
      }
    });
    this.addSubscription(uploadImageSubscription);
  }

  get userAvatar() {
    return this.uploadedImgUrl ? this.uploadedImgUrl : this.user?.picture;
  }

  userIsConsumer() {
    return this.userService.isConsumer();
  }
}
