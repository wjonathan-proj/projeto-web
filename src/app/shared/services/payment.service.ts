import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  apiURL = 'http://localhost:3000/vendas';

  constructor(private http: HttpClient) { }

  create(vendas) {
    return this.http.post(this.apiURL, vendas).pipe(take(1));
  }
}
