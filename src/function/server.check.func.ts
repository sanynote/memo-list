import {SystemError} from "../interface/error.interface";

export const serverCheck = () => {
  if (navigator.onLine === false) {
    const ErrorObject: SystemError = {
      code: 'auth/network-request-failed'
    }
    throw ErrorObject;
  }
}
