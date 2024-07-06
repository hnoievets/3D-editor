import { Route } from '../../../shared/constants/route';
import { StatusCode } from '../../../shared/constants/status_code';
import { ContentType, HttpHeader, StorageKey } from './constants';
import { tokenStorage } from './storage';

class AppApi {
  baseUrl;
  storage;

  constructor(baseUrl, storage) {
    this.baseUrl = baseUrl;
    this.storage = storage;
  }

  // функція для виконання http-запитів
  async load(path, options) {
    const {
      method, // http-метод
      contentType = ContentType.JSON, // mime-тип контенту 
      payload = null, // тыло запиту
      hasAuth, // флаг чи є акторизація
    } = options;

    // встановлення http-заголовків
    const headers = this.getHeaders(hasAuth, contentType);

    // визначення повного шляху
    const fullPath = this.baseUrl + path;

    // запит
    const response = await fetch(fullPath, {
      method,
      headers,
      body: payload,
    });

    // перевірка відповіді та повернення результату
    return await this.checkResponse(response);
  }

  // функція встановлення http-заголовків
  getHeaders(hasAuth, contentType) {
    const headers = new Headers();

    headers.append(HttpHeader.CONTENT_TYPE, contentType);

    if (hasAuth) {
      const token = this.storage.get(StorageKey.TOKEN);

      headers.append(HttpHeader.AUTHORIZATION, `Bearer ${token ?? ''}`);
    }

    return headers;
  }
   // перевірка відповіді
  async checkResponse(response) {
    if (!response.ok) {
      // обробка помилки
      await this.handleError(response);
    }

    return response;
  }

  // функція обробки помилки
  async handleError(response) {
    // скидання токену та перенаправлення користувача на сторінку
    // для входу в систему якщо прийшла помилка 401 
    if (response.status === StatusCode.UNAUTHORIZED) {
      this.storage.drop(StorageKey.TOKEN);
      window.location.assign(Route.LOG_IN);
    }

    // отримання повідомлення з помилки
    const parsedException = await response.json().catch(() => ({
      message: response.statusText,
    }));
    // викидування помилки з отриманим повідомленням 
    throw new Error(parsedException.message);
  }
}

const appApi = new AppApi('http://localhost:3000', tokenStorage);

export { appApi };
