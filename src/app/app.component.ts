import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ingresoEgresoApp';
  private authService = inject(AuthService);
  constructor(){
    this.authService.initAuthListener();
  }
}
