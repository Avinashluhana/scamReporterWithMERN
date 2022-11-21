import { store } from './app/store';
// import { useAppDispatch } from './app/hooks';
import { notify, close } from './store/notification.slice';

const defaultTimeout = 5000 // 5 sec

export class Notification {
  static error(message: string, timeout: number = defaultTimeout) {
    store.dispatch(notify({
      severity: 'error',
      message,
      timeout
    }));
  }
 
  static success(message: string, timeout: number = defaultTimeout) {
    store.dispatch(notify({
      severity: 'success',
      message,
      timeout
    }));
  }
 
  static info(message: string, timeout: number = defaultTimeout) {
    store.dispatch(notify({
      severity: 'info',
      message,
      timeout
    }));
  }

  static warning(message: string, timeout: number = defaultTimeout) {
    store.dispatch(notify({
      severity: 'warning',
      message,
      timeout
    }));
  }
  
  static close() {
    store.dispatch(close())
  }
}
