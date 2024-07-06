import { StorageKey } from './constants';

class TokenStorage {
  #store;
  #key;

  constructor(store, key) {
    this.#store = store;
    this.#key = key;
  }
  // отримання токену
  get() {
    return this.#store.getItem(this.#key);
  }
  // задавання токену
  set(value) {
    if (!value) {
      return;
    }

    this.#store.setItem(this.#key, value);
  }
  // видалення токену з сховища
  drop() {
    this.#store.removeItem(this.#key);
  }
}

const tokenStorage = new TokenStorage(window.localStorage, StorageKey.TOKEN);

export { tokenStorage };
