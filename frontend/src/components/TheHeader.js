import React, { useState, useEffect } from "react";
import styles from "./TheHeader.module.scss";
import { CSSTransition } from "react-transition-group";
import AccountForm from "../components/AccountForm";
import { connect } from "react-redux";
import { LOG_IN, LOG_OUT } from "../redux/store";

const mapStateToProps = (state) => state.userStore;

const mapDispatchToProps = {
  LOG_IN,
  LOG_OUT,
};

function TheHeader(props) {
  const [accountDropdownOpen, toggleAccountDropdown] = useState(false);

  useEffect(() => {
    validateSession();
  }, []);

  async function validateSession() {
    const lastSessionToken = window.localStorage.getItem("sessionToken");
    const rawData = await fetch("http://localhost:8080/api/session", {
      headers: {
        Authorization: `Bearer ${lastSessionToken}`,
      },
    });
    if (rawData.status === 401) {
      window.localStorage.removeItem("sessionToken");
      return;
    }
    const sessionData = await rawData.json();
    if (sessionData && sessionData.username && sessionData.fullName)
      props.LOG_IN({
        username: sessionData.username,
        fullName: sessionData.fullName,
        token: lastSessionToken,
      });
  }

  return (
    <div className={styles.header__container}>
      <div className={styles.account__toggle}>
        <span
          className="material-icons"
          onClick={() => toggleAccountDropdown(!accountDropdownOpen)}
        >
          account_box
        </span>
        <span className={styles.account__status}>
          {props.loggedIn
            ? `logged in as ${props.username}`
            : "log in to participate"}
        </span>
      </div>
      <CSSTransition
        in={accountDropdownOpen}
        timeout={300}
        unmountOnExit
        classNames="slide"
      >
        <AccountForm closeDropdown={() => toggleAccountDropdown(false)} />
      </CSSTransition>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(TheHeader);
