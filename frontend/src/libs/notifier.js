import { Slide, toast } from 'react-toastify';

class Notifier {
  error(message = 'Unknown Error!', options) {
    this.showToast(message, {
      ...options,
      type: 'error',
    });
  }

  success(message = 'Unknown Error!', options) {
    this.showToast(message, {
      ...options,
      type: 'success',
    });
  }

  showToast(message, options) {
    toast(message, this.#mapOptions(options));
  }

  #mapOptions({ position = 'top-right', transition = Slide, type }) {
    return {
      position,
      transition,
      type,
    };
  }
}

const notifier = new Notifier();

export { notifier };
