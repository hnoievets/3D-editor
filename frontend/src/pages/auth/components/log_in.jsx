import { useState } from 'react';
import styles from './styles.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { Route } from '../../../../../shared/constants/route';
import { appApi } from '../../../libs/app_api';
import { tokenStorage } from '../../../libs/storage';
import { HttpMethod } from '../../../libs/constants';
import { notifier } from '../../../libs/notifier';
import { Loader } from '../../../libs/components/loader';

function LogIn() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    appApi
      .load(Route.AUTH + Route.LOG_IN, {
        method: HttpMethod.POST,
        payload: JSON.stringify(form),
      })
      .then((response) => response.json())
      .then(({ token }) => {
        tokenStorage.set(token);
        navigate(Route.PROJECTS);
      })
      .catch((err) => notifier.error(err.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={styles.authContainer}>
      <Loader isLoading={isLoading}>
        <div className={styles.authBody}>
          <h2>Log In</h2>
          <form onSubmit={handleSubmit} className={styles.authForm}>
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
              min="5"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <button type="submit" disabled={isLoading}>
              Log In
            </button>
          </form>
          <div className={styles.messageWrapper}>
            <NavLink to={Route.SIGN_UP} end>
              <span className={styles.message}>No account?</span>
            </NavLink>
          </div>
        </div>
      </Loader>
    </div>
  );
}

export default LogIn;
