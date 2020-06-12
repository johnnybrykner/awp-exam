import React, { useState } from "react";
import styles from "./SuggestionCard.module.scss";
import { connect } from "react-redux";

const mapStateToProps = (state) => state.userStore;

function SuggestionCard(props) {
  const [originalState, setOriginalState] = useState({
    visibility: props.suggestionData.visibility,
    title: props.suggestionData.title,
    description: props.suggestionData.description,
  });

  const [visibility, setVisibility] = useState(props.suggestionData.visibility);

  const [title, setTitle] = useState(props.suggestionData.title);

  const [description, setDescription] = useState(
    props.suggestionData.description
  );

  const [hasStateChanged, stateChange] = useState(false);

  function toggleVisibility() {
    setVisibility(!visibility);
    stateChange(true);
  }

  function changeTitle() {}

  function changeDescription() {}

  function submitChanges() {
    console.log("Submit!");
    stateChange(false);
    setOriginalState({
      visibility,
      title,
      description,
    });
  }

  return (
    <div
      className={
        visibility
          ? styles.suggestion__container + " fancy"
          : styles.suggestion__container + " fancy hidden"
      }
    >
      {props.loggedIn && props.adminAccount && props.showAdminActions && (
        <div
          className={styles.suggestion__admin}
          onClick={(event) => event.preventDefault()}
        >
          <div
            className={
              visibility === originalState.visibility
                ? styles.suggestion__visibility
                : styles.suggestion__visibility + " altered"
            }
            onClick={() => toggleVisibility()}
          >
            <span>
              {visibility ? "Suggestion visible" : "Suggestion invisible"}
            </span>
            <span className="material-icons">
              {visibility ? "visibility" : "visibility_off"}
            </span>
          </div>
          {hasStateChanged && (
            <div
              className={styles.confirm__changes}
              onClick={() => submitChanges()}
            >
              <span>Confirm changes</span>
              <span className="material-icons">done</span>
            </div>
          )}
        </div>
      )}
      <div className={styles.suggestion__header}>
        <div className={styles.suggestion__icons}>
          <section>
            <span className="material-icons">account_circle</span>
            <span
              className={styles.suggestion__user}
            >{`${props.suggestionData.fullName} (${props.suggestionData.username})`}</span>
          </section>
          <section>
            <span className="material-icons">schedule</span>
            <span className={styles.suggestion__date}>
              {props.suggestionData.date}
            </span>
          </section>
        </div>
      </div>
      <h2
        className={
          title === originalState.title
            ? styles.suggestion__title
            : styles.suggestion__title + " altered"
        }
      >
        {title}
      </h2>
      <p
        className={
          description === originalState.description
            ? styles.suggestion__description
            : styles.suggestion__description + " altered"
        }
      >
        {description}
      </p>
      <span className={styles.suggestion__signatures}>
        {props.suggestionData.signatures &&
        props.suggestionData.signatures.length
          ? `${props.suggestionData.signatures.length} signature(s) supporting this suggestion`
          : "There are no signatures"}
      </span>
    </div>
  );
}

export default connect(mapStateToProps)(SuggestionCard);
