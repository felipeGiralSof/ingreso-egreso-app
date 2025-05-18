import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as uiActions from '../../shared/ui.actions';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports:[CommonModule, ReactiveFormsModule]
})
export class RegisterComponent implements OnInit, OnDestroy{

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store<AppState>);
  registroForm!: FormGroup;
  uiSubscribe!: Subscription;
  cargando: any = false;

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.uiSubscribe = this.store.select('ui')
      .subscribe(loading => this.cargando = loading);
  }

  ngOnDestroy(): void {
    this.uiSubscribe.unsubscribe();
  }


  get name(){
    return Boolean(this.registroForm.get('nombre')?.valid);
  }

  get email(){
    return Boolean(this.registroForm.get('correo')?.valid);
  }

  get password(){
    return Boolean(this.registroForm.get('password')?.valid);
  }

  crearUsuario(){

    if(this.registroForm.invalid) return;

    this.store.dispatch(uiActions.isLoading());

    // Swal.fire({
    //   title: "Espere por favor",
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // })

    const {nombre, correo, password} = this.registroForm.value;

    this.authService.crearUsuario(nombre, correo, password)
      .then(() => {
        this.store.dispatch(uiActions.stopLoading());
        //Swal.close();
        this.router.navigate(['/']);
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
