import api from './api';

async function signIn(mail: string, password: string) {
  try{
    const {data} = await api.post("/user/login", { mail, password });
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function userCreate(mail: string, password: string) {
  try{
    const {data} = await api.post("/user/create", { mail, password });
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function petList() {
  try{
    const {data} = await api.get("/pet/list");
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function petCreate(name: string) {
  try{
    const {data} = await api.post("/pet/create", { name });
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function petRemove(idpet: string) {
  try{
    const {data} = await api.delete("/pet/remove", { data: {idpet} });
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function paymentCreate(idpet: string, description: string, value: string) {
  try{
    const {data} = await api.post("/payment/create", { idpet, description, value });
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function paymentList(idpet: string) {
  try{
    const {data} = await api.post("/payment/list", {idpet});
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function paymentRemove(idpayment: string) {
  try{
    const {data} = await api.delete("/payment/remove", { data: {idpayment} });
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function medicineCreate(idpet: string, name: string) {
  try{
    const {data} = await api.post("/medicine/create", { idpet, name });
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function medicineList(idpet: string) {
  try{
    const {data} = await api.post("/medicine/list", {idpet});
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function medicineRemove(idmedicine: string) {
  try{
    const {data} = await api.delete("/medicine/remove", { data: {idmedicine} });
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

export {
  signIn,
  userCreate,
  petList,
  petCreate,
  petRemove,
  paymentCreate,
  paymentList,
  paymentRemove,
  medicineCreate,
  medicineList,
  medicineRemove
};