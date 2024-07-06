import { useState } from 'react';
import styles from './styles.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { Route } from '../../../../../shared/constants/route';
import { appApi } from '../../../libs/app_api';
import { HttpMethod } from '../../../libs/constants';
import { tokenStorage } from '../../../libs/storage';
import { notifier } from '../../../libs/notifier';
import { Loader } from '../../../libs/components/loader';

function SignUp() {
  // стан форми
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    email: '',
    password: '',
  });

  // стан завантаження
  const [isLoading, setIsLoading] = useState(false);

  // навігатор по сторінках
  const navigate = useNavigate();

  // обрабник події change у формі
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // обробник надіслання форми
  const handleSubmit = (e) => {
    // відміна перезагрузки сторінки
    e.preventDefault();

    setIsLoading(true);

    // відправка форми
    appApi
      .load(Route.AUTH + Route.SIGN_UP, {
        method: HttpMethod.POST,
        payload: JSON.stringify(form),
      })
      // парсінг відповіді у javascript об'єкт
      .then((response) => response.json())
      // отримання відповіді з токеном
      .then(({ token }) => {
        // зберігання його на стороні клієнта
        tokenStorage.set(token);
        // перехід до сторінки з проєктами користувача
        navigate(Route.PROJECTS);
      })
      // обробка помилки
      .catch((err) => notifier.error(err.message))
      // прибирання відображення завантаження
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={styles.authContainer}>
      <Loader isLoading={isLoading}>
        <div className={styles.authBody}>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <input
              type="text"
              name="firstName"
              required
              placeholder="Firs name"
              value={form.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              required
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <button type="submit" disabled={isLoading}>
              Sign Up
            </button>
          </form>
          <div className={styles.messageWrapper}>
            <NavLink to={Route.LOG_IN}>
              <span className={styles.message}>Already have an account?</span>
            </NavLink>
          </div>
        </div>
      </Loader>
    </div>
  );
}

export default SignUp;
