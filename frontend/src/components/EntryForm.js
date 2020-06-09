import React, { useState } from "react";
import styles from "./AccountForm.module.scss";
import { connect } from "react-redux";

const mapStateToProps = (state) => state.userStore;

function AccountForm(props) {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function inputChange(event) {
    setError("");
    // event.target.name === "username" ? setUsername(event.target.value) : setPassword(event.target.value);
  }

  return (
    <div className={styles.form__container}>
      <h2>{`Type your ${props.formType} below:`}</h2>
      <input type="text" name="title" onChange={inputChange} placeholder="" />
      <input
        type="password"
        name="password"
        onChange={inputChange}
        placeholder="Password"
      />
      <span className={styles.form_error + " error"}>{error}</span>
      <input type="submit" value="Submit" className="fancy" />
    </div>
  );
}

export default connect(mapStateToProps)(AccountForm);
