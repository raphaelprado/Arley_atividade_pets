import React, { useState, useEffect, createContext, useContext } from "react";
import * as auth from '../services/auth';
import api from "../services/api";
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({});

// extrai o children em <AuthProdiver> children </AuthProvider>
// no children estarão as rotas definidas por Navigator e Screen 
const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string>('');
  const [mail, setMail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // o useEffect que vai ser disparado assim que o AuthProvider for construído em tela
  useEffect(() => {
    async function loadStorageData() {
      const storagedToken = await SecureStore.getItemAsync('token');
      const storagedMail = await SecureStore.getItemAsync('mail');
      
      if (storagedToken && storagedMail) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storagedToken}`;
        setMail(storagedMail);
        setToken(storagedToken);
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(mail: string, password: string) {
    const response = await auth.signIn(mail,password);
    
    if( response.token && response.mail ){
      api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
      await SecureStore.setItemAsync('token', response.token);
      await SecureStore.setItemAsync('mail', response.mail);
      setToken(response.token);
      setMail(response.mail);
    }
    else{
      return {error: response.error || "Problemas ao executar a operação"};
    }
  }

  async function signOut() {
    api.defaults.headers.common["Authorization"] = ""
    setToken('');
    setMail('');
    SecureStore.deleteItemAsync('token');
    SecureStore.deleteItemAsync('mail');
  }

  async function userCreate(mail: string, password: string) {
    const response = await auth.userCreate(mail,password);
    if( response.token && response.mail ){
      api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
      await SecureStore.setItemAsync('token', response.token);
      await SecureStore.setItemAsync('mail', response.mail);
      setToken(response.token);
      setMail(response.mail);
    }
    else{
      return {error: response.error || "Problemas ao executar a operação"};
    }
  }

  async function petList() {
    return await auth.petList();
  }

  async function petCreate(name: string) {
   return await auth.petCreate(name);
  }

  async function petRemove(idpet: string) {
    return await auth.petRemove(idpet);
  }

  async function paymentCreate(idpet: string, description: string, value: string) {
    return await auth.paymentCreate(idpet, description, value);
  }

  async function paymentList(idpet: string) {
    return await auth.paymentList(idpet);
  }

  async function paymentRemove(idpayment: string) {
    return await auth.paymentRemove(idpayment);
  }

  async function medicineList(idpet: string) {
    return await auth.medicineList(idpet);
  }

  async function medicineCreate(idpet: string, name: string) {
    return await auth.medicineCreate(idpet, name);
  }

  async function medicineRemove(idmedicine: string) {
    return await auth.medicineRemove(idmedicine);
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, token, mail, loading, userCreate, petList, petCreate, petRemove, paymentCreate, paymentList, paymentRemove,  medicineCreate, medicineRemove, medicineList}}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};