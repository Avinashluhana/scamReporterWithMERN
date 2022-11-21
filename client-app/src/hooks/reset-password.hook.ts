import { useState } from "react";
import { resetPassword, ResetPasswordInput } from '../services/auth.service';
import { Notification } from "../notification.helper";
import { AxiosError } from "axios";

export function useResetPassword(onSuccess?: Function, onFailure?: Function) {
  const [ loading, setLoading ] = useState<boolean>(false);

  const onResetPassword = async (input: ResetPasswordInput) => {
    try {
      setLoading(true);

      const result = await resetPassword(input);
      Notification.success(result.data.message);
      if (onSuccess) onSuccess(result);
  
    } catch (error: any) {
      if (error instanceof AxiosError) {
        Notification.error(error.response?.data.message);
        if (onFailure) onFailure(error);
        return;
      }
      Notification.error(error.message || error.name);
      if (onFailure) onFailure(error);
    } finally {
      setLoading(false);
    }
  }

  return { loading, onResetPassword };
}