import React, { useState } from "react";
import styles from "./AccountForm.module.scss";
import { connect } from "react-redux";
import { LOG_IN, LOG_OUT } from "../redux/store";

const mapDispatchToProps = {
  LOG_IN,
  LOG_OUT,
};

function AccountForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function inputChange(event) {
    setError("");
    event.target.name === "username"
      ? setUsername(event.target.value)
      : setPassword(event.target.value);
  }

  async function login() {
    if (username.trim() && password.trim()) {
      const rawData = await fetch("http://localhost:8080/api/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const sessionData = await rawData.json();
      if (sessionData.error) setError(sessionData.error);
      if (sessionData.token) {
        setError("");
        props.closeDropdown();
        props.LOG_IN({
          username: sessionData.username,
          fullName: sessionData.fullName,
          token: sessionData.token,
        });
        window.localStorage.setItem("sessionToken", sessionData.token);
      }
    } else {
      setError("Please fill in both credentials");
    }
  }

  return (
    <div className={styles.form__container}>
      <h2>Log in using your account credentials</h2>
      <input
        type="text"
        name="username"
        onChange={inputChange}
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        onChange={inputChange}
        placeholder="Password"
      />
      <span className={styles.form_error + " error"}>{error}</span>
      <input type="submit" value="Submit" className="fancy" onClick={login} />
    </div>
  );
}

export default connect(null, mapDispatchToProps)(AccountForm);
