import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
  imports: [RouterOutlet]
})
export class AppComponent {
  title = 'ingresoEgresoApp';
  private authService = inject(AuthService);
  constructor(){
    this.authService.initAuthListener();
  }
}
