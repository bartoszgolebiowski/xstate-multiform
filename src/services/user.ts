import { UserData } from "../types";

const userEmpty: UserData = {
  name: null,
  surname: null,
  email: null,
  phone: null,
  street: null,
  city: null,
  code: null,
  country: null,
  account: null,
  creaditCardNo: null,
  creditCardExp: null,
  creditCardCvv: null,
};

export const getUser = async (prevUser = userEmpty) => {
  await new Promise((res) => setTimeout(res, 1000));
  
  return prevUser;
};

export const updateUser = async (updated: UserData) => {
  await new Promise((res) => setTimeout(res, 1000));

  return updated;
};
