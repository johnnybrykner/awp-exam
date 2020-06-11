import React, { useState } from "react";
import styles from "./AccountForm.module.scss";
import { CSSTransition } from "react-transition-group";
import { connect, useDispatch } from "react-redux";
import {
  LOG_IN,
  LOG_OUT,
  SET_ACCOUNT_FORM_TYPE,
  VALID_SESSION,
} from "../redux/store";

const mapDispatchToProps = {
  LOG_OUT,
  SET_ACCOUNT_FORM_TYPE,
  VALID_SESSION,
};

const mapStateToProps = (state) => state.userStore;

function AccountForm(props) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  function inputChange(event) {
    setError("");
    event.target.name === "username"
      ? setUsername(event.target.value)
      : event.target.name === "fullName"
      ? setFullName(event.target.value)
      : setPassword(event.target.value);
  }

  function switchForm() {
    props.accountFormType === "login"
      ? props.SET_ACCOUNT_FORM_TYPE("register")
      : props.SET_ACCOUNT_FORM_TYPE("login");
  }

  function submit() {
    if (
      (props.accountFormType === "login" &&
        (!username.trim() || !password.trim())) ||
      (props.accountFormType === "register" &&
        (!username.trim() || !password.trim() || !fullName.trim()))
    ) {
      setError("Please fill in all the credentials");
      return;
    }
    props.accountFormType === "login"
      ? login()
      : props.accountFormType === "register"
      ? register()
      : props.LOG_OUT();
  }

  async function login() {
    const result = await dispatch(LOG_IN({ username, password }));
    if (result.error) setError(result.payload);
    if (result.payload && result.payload.token) {
      setError("");
      props.closeDropdown();
      window.localStorage.setItem("sessionToken", result.payload.token);
    }
  }

  async function register() {
    const rawData = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username,
        fullName,
        password,
      }),
    });
    const response = await rawData.json();
    if (response.error) setError(response.error);
    if (response && response.username && response.fullName && response.token) {
      props.VALID_SESSION({
        username: response.username,
        fullName: response.fullName,
        token: response.token,
      });
      setError("");
      props.closeDropdown();
      window.localStorage.setItem("sessionToken", response.token);
    }
  }

  return (
    <div className={styles.form__wrapper}>
      {props.accountFormType !== "logout" && (
        <div className={styles.form__container}>
          <h2>
            {props.accountFormType === "login"
              ? "Log in using your account credentials"
              : "Register by filling out the fields below"}
          </h2>
          <input
            type="text"
            name="username"
            onChange={inputChange}
            placeholder="Username"
            onKeyPress={({ charCode }) => {
              if (charCode === 13) submit();
            }}
          />
          <CSSTransition
            in={props.accountFormType === "register"}
            timeout={300}
            unmountOnExit
            classNames="pop"
          >
            <input
              type="text"
              name="fullName"
              onChange={inputChange}
              placeholder="Full Name"
              onKeyPress={({ charCode }) => {
                if (charCode === 13) submit();
              }}
            />
          </CSSTransition>
          <input
            type="password"
            name="password"
            onChange={inputChange}
            placeholder="Password"
            onKeyPress={({ charCode }) => {
              if (charCode === 13) submit();
            }}
          />
          <span className={styles.form__error + " error"}>{error}</span>
          <div className={styles.account__cta}>
            <span>
              {props.accountFormType === "login"
                ? "Don't have an account?"
                : "Already a member?"}
            </span>
            <span
              className={styles.account__action}
              onClick={() => switchForm()}
            >
              {props.accountFormType === "login"
                ? "REGISTER HERE"
                : "LOGIN HERE"}
            </span>
          </div>
        </div>
      )}
      <input
        type="submit"
        value={props.accountFormType === "logout" ? "Logout" : "Submit"}
        className="fancy"
        onClick={submit}
      />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountForm);
