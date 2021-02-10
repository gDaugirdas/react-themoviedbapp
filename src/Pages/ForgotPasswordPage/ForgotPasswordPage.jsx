import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSuccess('');
      setError('');
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setSuccess('Check your email inbox for further instructions');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('Entered email address does not exist in the database');
      } else {
        setError('Failed to reset password');
      }
    }
    setLoading(false);
  }

  return (
    <>
      <Helmet>
        <title>TMDB Forgot password</title>
        <meta name="description" content="Forgot password page" />
      </Helmet>
      <main className="main main--center">
        <div className="container">
          <div className="form--container">
            <div className="form__logo--container">
              <img className="form__logo" src="./images/logo.png" alt="logo" />
            </div>
            {error && <p className="form__message form__message--error">{error}</p>}
            {success && <p className="form__message form__message--success">{success}</p>}
            <h2 className="form__heading">Reset password</h2>
            <form className="form" onSubmit={handleSubmit}>
              <label className="form__label" htmlFor="email">
                <input
                  className="form__input"
                  type="email"
                  htmlFor="email"
                  ref={emailRef}
                  required
                />
                <p className="form__label-text">Email</p>
              </label>
              <button className="button--bold" disabled={loading} type="submit">
                Reset password
              </button>
            </form>
            <p className="form__secondary-text">
              <Link
                className="link link__text link__text--color-yellow link__text--fontsize-small"
                to="/login"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
