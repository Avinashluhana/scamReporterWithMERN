import { useState } from "react";
import { forgetPassword, ForgetPasswordInput } from '../services/auth.service';
import { Notification } from "../notification.helper";

export function useForgetPassword(onSuccess?: Function, onFailure?: Function) {
  const [ loading, setLoading ] = useState<boolean>(false);

  const onForgetPassword = async (input: ForgetPasswordInput) => {
    try {
      setLoading(true);

      const result = await forgetPassword(input);
      Notification.success(result.data.message);
      if (onSuccess) onSuccess(result);
  
    } catch (error: any) {
      Notification.error(error.message || error.name);
      if (onFailure) onFailure(error);
    } finally {
      setLoading(false);
    }
  }

  return { loading, onForgetPassword };
}