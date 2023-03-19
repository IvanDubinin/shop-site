import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { IAvatarCloudResponse, IUser } from '../../types/user.interface';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BnNgIdleService } from 'bn-ng-idle';
import { ModalWindowService } from './modalWindow.service';
import { IHttpParams } from '../../types/HttpParams.interface';
import { buildParamsObject } from '../../helpers/buildParamsObject';
import { LoggingService } from './logging-service';

const CLOUD_NAME = 'dljbrfsv6';
const UPLOAD_ENDPOINT = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;
const UPLOAD_PRESET = 'deafult_unsigned_preset';

const BACK_URL = `${environment.apiUrl}/users`;

const INCORRECT_EMAIL_OR_PASSWORD = 'Incorrect email or password';
const USER_ALREADY_EXISTS = 'User Already Exists';
const SUCCESSFULLY_SIGNED_UP = 'Successfully Signed Up';
const SUCCESSFULLY_SIGNED_IN = 'Successfully Signed In';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userSubject: BehaviorSubject<IUser | null>;
  public currentUser: IUser | null;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  snackBarDuration: number = 3500;

  constructor(
    private http: HttpClient,
    private router: Router,
    public loggingService: LoggingService,
    public dialog: MatDialog,
    private bnIdle: BnNgIdleService,
    private modalWindowService: ModalWindowService
  ) {
    this.userSubject = new BehaviorSubject<IUser | null>(this.authorizedUser);
    this.userSubject.subscribe((user) => (this.currentUser = user));
  }

  getUser() {
    return this.userSubject;
  }

  modalConfig = {
    data: {
      title: 'Session timeout',
      content: 'The session has expired. Please refresh the page',
      buttonOK: 'Keep me logged in'
    },
    width: '500px',
    panelClass: 'dialog'
  };

  get authorizedUser() {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user') as string);
    } else {
      return JSON.parse(sessionStorage.getItem('user') as string);
    }
  }

  getUsers(params: IHttpParams = {}): Observable<IUser[]> {
    const httpParams = new HttpParams({
      fromObject: buildParamsObject(params)
    });

    return this.http
      .get<IUser[]>(BACK_URL, {
        params: httpParams,
        observe: 'response'
      })
      .pipe(
        map((httpResponse) => {
          return httpResponse.body!;
        })
      );
  }

  getUsersByEmail(email: string): Observable<IUser[]> {
    const params: IHttpParams = {
      email
    };
    return this.getUsers(params);
  }

  getById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${BACK_URL}/${id}`);
  }

  showAndThrowError(message: string) {
    this.loggingService.logError({
      title: 'Error',
      message,
      removeByTimeout: 3000
    });
    throw new Error(message);
  }

  showSuccessMessage(message: string) {
    this.loggingService.logBusinessAction({
      title: 'Done!',
      message,
      removeByTimeout: 3000
    });
  }

  register(user: Omit<IUser, 'id'>): Observable<IUser> {
    return this.getUsersByEmail(user.email).pipe(
      switchMap((users) => {
        if (users.length > 0) {
          this.showAndThrowError(USER_ALREADY_EXISTS);
        }
        return this.http
          .post<IUser>(BACK_URL, user)
          .pipe(tap(() => this.showSuccessMessage(SUCCESSFULLY_SIGNED_UP)));
      })
    );
  }

  startTimer() {
    this.bnIdle.startWatching(environment.userLogout).subscribe((isTimedOut: boolean) => {
      let modalAnswer = false;
      if (isTimedOut) {
        this.modalWindowService.modalLogout(this.modalConfig).subscribe({
          next: (data) => {
            if (data) {
              modalAnswer = true;
              this.bnIdle.resetTimer();
            } else {
              this.logout();
              this.bnIdle.stopTimer();
            }
          }
        });
      }
    });
  }

  login(email: string, password: string, toRemember: boolean): Observable<IUser> {
    return this.getUsersByEmail(email).pipe(
      map((users) => {
        const user = users[0];
        if (!user || user.password !== password) {
          this.showAndThrowError(INCORRECT_EMAIL_OR_PASSWORD);
        }

        toRemember
          ? localStorage.setItem('user', JSON.stringify(user))
          : sessionStorage.setItem('user', JSON.stringify(user));

        this.userSubject.next(user);
        this.showSuccessMessage(SUCCESSFULLY_SIGNED_IN);
        this.dialog.closeAll();
        this.startTimer();

        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['home']);
  }

  updateUser(user: IUser): Observable<IUser> {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
    return this.http.put<IUser>(`${BACK_URL}/${user.id}`, user);
  }

  isConsumer(): boolean {
    return this.userSubject.getValue()?.role === 'consumer';
  }

  isSeller(): boolean {
    return this.userSubject.getValue()?.role === 'seller';
  }

  isAdmin(): boolean {
    return this.userSubject.getValue()?.role === 'admin';
  }

  updateUserAvatar(file: File): Observable<IAvatarCloudResponse> {
    const formData: FormData = new FormData();
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('Delivery type', 'upload');
    formData.append('file', file);

    return this.http.post<IAvatarCloudResponse>(`${UPLOAD_ENDPOINT}/upload`, formData);
  }
}
