import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Validacoes } from '../shared/helpers/validacoesHelper';
import { isValid } from 'cc-validate';
import { PaymentService } from '../shared/services/payment.service';
import { DateAdapter } from '@angular/material';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],

})

export class PaymentComponent implements OnInit {
  FormRegister: FormGroup;
  status = {
    isDanger: true,
    valid: true };
    MsgError = '';
    Today = new Date();
  

  FormPayment: FormGroup;
  creditcardurl = '';
  value = 0 ;

  creditcard = document.getElementById('creditcard');
  constructor(private fb: FormBuilder, private service: PaymentService, private adapter: DateAdapter<any>) { }

  ngOnInit() {
    this.newPaymentForm();
    this.Listentochanges();
    this.getTotal();
    
  }

  FormatData(date: string) {
    let ano =  date.substring(0,4);
    let mes = date.substring(5,7);
    let dia = date.substring(8,10);

    return (dia + '/' +  mes + '/' + ano);
  }

  getTotal() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart.forEach(element => {
      this.value = this.value + (element.product.valor * element.quantity);
    });
  }

  NewPayment() {
    const FormData = this.FormPayment.value;
    FormData.birthday = this.FormatData(FormData.birthday);
    console.log(FormData);
  }

  Listentochanges() {

    this.FormPayment.controls['cardnumber'].valueChanges.subscribe(value => {
      // console.log(value);
      const cardnumber = isValid(value);
      switch (cardnumber['cardType']) {
        case 'Visa':
          this.creditcardurl = '../../assets/credit-card-logo/Visa.png';
          break;
        case 'MasterCard':
          this.creditcardurl = '../../assets/credit-card-logo/MasterCard.jpeg';
          break;
        case 'American Express':
            this.creditcardurl = '../../assets/credit-card-logo/AmericanExpress.png';
            break;
        case 'Discover':
          this.creditcardurl = '../../assets/credit-card-logo/Discover.jpg';
          break;
        case 'JCB':
          this.creditcardurl = '../../assets/credit-card-logo/Jcb.png';
          break;
        case 'Diners Club':
          this.creditcardurl = '../../assets/credit-card-logo/DinersClub.png';
          break;
        case 'Maestro':
          this.creditcardurl = '../../assets/credit-card-logo/Maestro.png';
          break;
      }
    });
  }

  newPaymentForm() {
    this.FormPayment = this.fb.group({
      cardnumber: [
        '',
        Validators.compose([
          Validators.required,
          Validacoes.CheckCreditCard
        ])
      ],
      expirationmonth: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      expirationyear: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      securenumber: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      name: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      birthday: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(2)
        ])
      ],
      cpf: [
        '',
        Validators.compose([
          Validators.required,
          Validacoes.ValidaCpf,
          Validators.maxLength(11)
        ])
      ],
      phone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]{5,11}')
        ])
      ],
      paymentmethod: [
        '',
        Validators.compose([
          Validators.required
        ])
      ]
    }
    );
    
  }

  OnSubmit() {
    this.status.valid = true;
    if (this.FormRegister.valid) {
      const formData = this.FormRegister.value;
      this.service.create(formData).subscribe(
        data => { this.status.isDanger = false;
                  this.status.valid = false;
                  this.MsgError = 'Novo pacote registrado com sucesso!'; },
        err => { this.status.isDanger = true;
                 this.status.valid = false;
                 console.log('falha:' + err);
                 this.MsgError = 'Falha:' + err;
                });
    } else {
      this.status.isDanger = true;
      this.status.valid = false;
      this.MsgError = 'Por favor, verifique os campos do seu formulário';
    }
  }


  get cardnumber() {
    return this.FormPayment.get('cardnumber');
  }
  get expirationdata() {
    return this.FormPayment.get('expirationdata');
  }
  get securenumber() {
    return this.FormPayment.get('securenumber');
  }
  get name() {
    return this.FormPayment.get('name');
  }
  get birthday() {
    return this.FormPayment.get('birthday');
  }
  get cpf() {
    return this.FormPayment.get('cpf');
  }
  get phone() {
    return this.FormPayment.get('phone');
  }
  get paymentmethod() {
    return this.FormPayment.get('paymentmethod');
  }
}
