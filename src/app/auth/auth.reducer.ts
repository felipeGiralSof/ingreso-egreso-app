import { Action, createReducer, on } from "@ngrx/store";
import { setUser, unSetUser } from "./auth.actions";
import { Usuario } from "../models/usuario.model";

export interface State {
  user: Usuario | null
}

export const initializeState: State = {
  user: null
};

const _authReducer = createReducer(initializeState,
  on(setUser, (state, {user} ) => ({...state, user: {...user}})),
  on(unSetUser, state => ({...state, user:null}))
);


export function authReducer(state: State | undefined, action: Action) {
  return _authReducer(state ?? initializeState, action);
}
