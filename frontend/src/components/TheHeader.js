import React, { useState, useEffect } from "react";
import styles from "./TheHeader.module.scss";
import { CSSTransition } from "react-transition-group";
import AccountForm from "../components/AccountForm";
import { connect } from "react-redux";
import { LOG_OUT, VALID_SESSION } from "../redux/store";

const mapStateToProps = (state) => state.userStore;

const mapDispatchToProps = {
  LOG_OUT,
  VALID_SESSION,
};

function TheHeader(props) {
  const [accountDropdownOpen, toggleAccountDropdown] = useState(false);

  useEffect(() => {
    validateSession();
  }, []);

  async function validateSession() {
    const lastSessionToken = window.localStorage.getItem("sessionToken");
    if (!lastSessionToken || !lastSessionToken.length) return;
    const rawData = await fetch(`${process.env.REACT_APP_API_URL}/session`, {
      headers: {
        Authorization: `Bearer ${lastSessionToken}`,
      },
    });
    if (rawData.status === 401) {
      window.localStorage.removeItem("sessionToken");
      return;
    }
    const sessionData = await rawData.json();
    if (sessionData && sessionData.username && sessionData.fullName) {
      props.VALID_SESSION({
        username: sessionData.username,
        fullName: sessionData.fullName,
        token: lastSessionToken,
      });
    }
  }

  return (
    <div className={styles.header__container}>
      <div
        className={styles.account__toggle}
        onClick={() => toggleAccountDropdown(!accountDropdownOpen)}
      >
        <span className="material-icons">account_box</span>
        <span className={styles.account__status}>
          {props.loggedIn
            ? `logged in as ${props.username}`
            : "currently not logged in"}
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
