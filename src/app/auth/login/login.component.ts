import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import * as uiActions from '../../shared/ui.actions';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit, OnDestroy{

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(Store<AppState>);
  loginForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;



  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui')
      .subscribe(ui => this.cargando = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  login(){
    if(this.loginForm.invalid) return;

    this.store.dispatch(uiActions.isLoading());

    // Swal.fire({
    //   title: "Espere por favor",
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // })

    const {email, password} = this.loginForm.value;

    this.authService.loginUsuario(email, password)
      .then(resp => {
        console.log("respp", resp);
        //Swal.close();
        this.store.dispatch(uiActions.stopLoading());
        this.router.navigate(['/'])
      })
      .catch(err => {
        this.store.dispatch(uiActions.stopLoading());
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      });


  }


}
