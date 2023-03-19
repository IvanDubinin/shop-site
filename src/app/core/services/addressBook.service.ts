import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { first, map, Observable } from 'rxjs';
import { ICountry } from 'src/app/types/country.interface';
import { ICity } from 'src/app/types/city.interface';
import { IAddressBook } from 'src/app/types/addressbook.interface';
import { IHttpParams } from 'src/app/types/HttpParams.interface';
import { buildParamsObject } from 'src/app/helpers/buildParamsObject';

const COUNTRY_URL: string = `${environment.apiUrl}/country`;
const CITY_URL: string = `${environment.apiUrl}/city`;
const ADDRESS_URL = `${environment.apiUrl}/addressBook`;

@Injectable({
  providedIn: 'root'
})
export class AddressBookService {
  constructor(private http: HttpClient) {}

  getCountries() {
    return this.http.get<ICountry[]>(COUNTRY_URL, {
      observe: 'body'
    });
  }

  getCities() {
    return this.http.get<ICity[]>(CITY_URL, {
      observe: 'body'
    });
  }

  getCityByCountryId(countryId: number) {
    return this.http
      .get<ICity[]>(CITY_URL, {
        params: { countryId }
      })
      .pipe(
        first(),
        map((singleItemArr) => singleItemArr[0])
      );
  }

  createAddress(addressBook: Omit<IAddressBook, 'id'>): Observable<IAddressBook> {
    return this.http.post<IAddressBook>(ADDRESS_URL, addressBook);
  }

  updateAddress(address: IAddressBook) {
    return this.http.put<IAddressBook>(`${ADDRESS_URL}/${address.id}`, address);
  }

  getAddresses(params: IHttpParams = {}): Observable<IAddressBook[]> {
    const httpParams = new HttpParams({
      fromObject: buildParamsObject(params)
    });
    return this.http.get<IAddressBook[]>(ADDRESS_URL, {
      params: httpParams,
      observe: 'body'
    });
  }

  getAddressesByUserId(userId: number): Observable<IAddressBook[]> {
    const params: IHttpParams = {
      userId
    };
    return this.getAddresses(params);
  }

  getAddress(id: number): Observable<IAddressBook> {
    return this.http.get<IAddressBook>(`${ADDRESS_URL}/${id}`);
  }

  deleteAddress(id: number): Observable<unknown> {
    return this.http.delete<unknown>(`${ADDRESS_URL}/${id}`);
  }
}
