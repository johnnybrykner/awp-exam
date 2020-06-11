import React, { useState } from "react";
import styles from "./SuggestionForm.module.scss";
import { connect } from "react-redux";
import moment from "moment";

const mapStateToProps = (state) => state.userStore;

function SuggestionForm(props) {
  const [title, setTitle] = useState("");
  const [body, setSuggestion] = useState("");
  const [error, setError] = useState("");

  function inputChange(event) {
    setError("");
    event.target.name === "title"
      ? setTitle(event.target.value)
      : setSuggestion(event.target.value);
  }

  async function submitSuggestion() {
    if (!props.loggedIn) return;
    if (!title.trim() || !body.trim()) {
      setError("Please fill in both the title and the body");
      return;
    }
    const rawData = await fetch(
      `${process.env.REACT_APP_API_URL}/suggestions`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        method: "POST",
        body: JSON.stringify({
          title,
          description: body,
          date: moment().format("DD MMM YYYY, HH:mm"),
          username: props.username,
          fullName: props.fullName,
          visibility: true,
          sigatures: [],
        }),
      }
    );
    const response = await rawData.json();
    if (response._id) {
      props.requestDataRefresh();
      props.closeSuggestionDrawer();
    }
  }

  return (
    <div className={styles.suggestion__wrapper}>
      <span
        className={styles.form__close + " material-icons"}
        onClick={() => props.closeSuggestionDrawer()}
      >
        close
      </span>
      <div className={styles.form__container}>
        <h2 className={styles.form__heading}>Type your suggestion below:</h2>
        <input
          type="text"
          name="title"
          onChange={inputChange}
          placeholder="Suggestion title"
          onKeyPress={({ charCode }) => {
            if (charCode === 13) submitSuggestion();
          }}
        />
        <textarea
          onChange={inputChange}
          name="body"
          placeholder="Your suggestion"
        />
        <span className={styles.form_error + " error"}>{error}</span>
        <input
          type="submit"
          value={props.loggedIn ? "Submit" : "Log in to submit your suggestion"}
          className={props.loggedIn ? "fancy" : "disabled"}
          onClick={() => submitSuggestion()}
        />
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(SuggestionForm);
