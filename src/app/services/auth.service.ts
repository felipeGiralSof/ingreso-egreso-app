import { Injectable, inject } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { map, Observable, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Auth } from '@angular/fire/auth';
import { authState } from 'rxfire/auth';



@Injectable({providedIn: 'root'})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private store =  inject(Store<AppState>);

  userSubscription!: Subscription;


  initAuthListener(){
    authState(this.auth).subscribe(fuser => {
      console.log("FUSER = ",fuser);
      if(fuser){
        const userRef = doc(this.firestore,`usuarios/${fuser.uid}`);
        this.userSubscription = docData(userRef).subscribe(firestoreUser => {
          const user = Usuario.fromFirebase(firestoreUser);
          console.log("USER = ", user);
          this.store.dispatch( authActions.setUser({user: user}))
        });

      }else{
        this.userSubscription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
        console.log("llamar unset del user");
      }
    })
  }

  // crearUsuario(nombre:string, email:string, password:string){
  //   return this.authFire.createUserWithEmailAndPassword(email, password)
  //     .then(async ({user}) => {
  //       if(!user) throw new Error('No se pudo crear el usuario');
  //       console.log('userrr', user);
  //       const newUser = new Usuario(user?.uid ?? '', nombre, user?.email ?? '');
  //       console.log("newUserrr", newUser);
  //       let collectionName: string = `usuarios/${user?.uid}`;
  //       console.log('collectionName', collectionName);
  //       await this.firestore.doc(`usuarios/${user?.uid}`).set({ ...newUser });
  //       return user;
  //     })
  //     .catch(err => console.error("errorrrrrresss",err));
  // }

  async crearUsuario(nombre:string, email:string, password:string){
    try{
      let user =  await createUserWithEmailAndPassword(this.auth, email, password);
      if(!user) throw new Error('No se pudo crear el usuario');
      const newUser = new Usuario(user.user?.uid ?? '', nombre, user.user?.email ?? '');
      console.log("newUserrr", newUser);
      const userRef =  doc(this.firestore, `usuarios/${user.user?.uid}`);
      await setDoc(userRef, {...newUser});
      return user.user;
    }catch(e){
      console.log("ERROR = ", e);
      return;
    }
  }

  loginUsuario(email:string, password: string){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(){
    return signOut(this.auth);
  }

  isAuth(){
    return authState(this.auth).pipe(
      map(fbUser => fbUser != null)
    )
  }
}
