import { Routes } from '@angular/router';
import { dashboardRoutes } from './dashboard/dashboard.routes';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: dashboardRoutes,
    canActivate: [ authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
