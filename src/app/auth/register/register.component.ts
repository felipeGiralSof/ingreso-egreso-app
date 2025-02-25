import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  registroForm!: FormGroup;

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
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

    Swal.fire({
      title: "Espere por favor",
      didOpen: () => {
        Swal.showLoading();
      },
    })

    const {nombre, correo, password} = this.registroForm.value;

    this.authService.crearUsuario(nombre, correo, password)
      .then(credenciales => {
        console.log(credenciales);
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch(err => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      });
  }
}
