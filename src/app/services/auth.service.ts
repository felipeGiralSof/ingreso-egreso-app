import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authFire = inject(AngularFireAuth);

  constructor(private firestore: AngularFirestore){}

  initAuthListener(){
    this.authFire.authState.subscribe(fuser => {
      console.log(fuser?.uid);
      console.log(fuser?.email);
    })
  }

  crearUsuario(nombre:string, email:string, password:string){
    return this.authFire.createUserWithEmailAndPassword(email, password)
      .then(({user}) => {
        console.log('userrr', user);
        const newUser = new Usuario(user?.uid ?? '', nombre, user?.email ?? '');
        return this.firestore.collection(`${user?.uid}/usuario`).add({...newUser});
      })
      .catch(err => console.error(err));
  }

  loginUsuario(email:string, password: string){
    return this.authFire.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.authFire.signOut();
  }

  isAuth(){
    return this.authFire.authState.pipe(
      map(fbUser => fbUser != null)
    )
  }
}
