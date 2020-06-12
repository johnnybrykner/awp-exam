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
  const [editingTitle, toggleTitleEditing] = useState(false);

  const [description, setDescription] = useState(
    props.suggestionData.description
  );
  const [editingDescription, toggleDescriptionEditing] = useState(false);

  const [hasStateChanged, stateChange] = useState(false);

  function toggleVisibility() {
    setVisibility(!visibility);
    stateChange(true);
  }

  function changeTitle() {
    if (!title.trim()) return;
    if (editingTitle) stateChange(true);
    toggleTitleEditing(!editingTitle);
  }

  function changeDescription() {
    if (!description.trim()) return;
    if (editingDescription) stateChange(true);
    toggleDescriptionEditing(!editingDescription);
  }

  async function submitChanges() {
    stateChange(false);
    setOriginalState({
      visibility,
      title,
      description,
    });
    const rawData = await fetch(
      `${process.env.REACT_APP_API_URL}/suggestion/${props.suggestionData._id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        method: "PUT",
        body: JSON.stringify({
          visibility,
          title,
          description,
        }),
      }
    );
    const updatedSuggestion = await rawData.json();
    console.log(updatedSuggestion);
  }

  return (
    <div
      className={
        visibility
          ? styles.suggestion__container + " fancy"
          : styles.suggestion__container + " fancy opaque"
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
      <div
        className={styles.title__container}
        onClick={(event) => event.preventDefault()}
      >
        {props.loggedIn &&
        props.adminAccount &&
        props.showAdminActions &&
        editingTitle ? (
          <input
            type="text"
            name="titleChange"
            className={styles.title__change}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyPress={(event) => {
              if (event.charCode === 13) {
                event.preventDefault();
                changeTitle();
              }
            }}
          />
        ) : (
          <h2
            className={
              title === originalState.title
                ? styles.suggestion__title
                : styles.suggestion__title + " altered"
            }
          >
            {title}
          </h2>
        )}
        {props.loggedIn && props.adminAccount && props.showAdminActions && (
          <span className="material-icons opaque" onClick={() => changeTitle()}>
            {(title === originalState.title && !editingTitle) || !editingTitle
              ? "edit"
              : "done"}
          </span>
        )}
      </div>
      <div
        className={styles.description__container}
        onClick={(event) => event.preventDefault()}
      >
        {props.loggedIn &&
        props.adminAccount &&
        props.showAdminActions &&
        editingDescription ? (
          <input
            type="text"
            name="descriptionChange"
            className={styles.description__change}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            onKeyPress={(event) => {
              if (event.charCode === 13) {
                event.preventDefault();
                changeDescription();
              }
            }}
          />
        ) : (
          <p
            className={
              description === originalState.description
                ? styles.suggestion__description
                : styles.suggestion__description + " altered"
            }
          >
            {description}
          </p>
        )}
        {props.loggedIn && props.adminAccount && props.showAdminActions && (
          <span
            className="material-icons opaque"
            onClick={() => changeDescription()}
          >
            {(description === originalState.description &&
              !editingDescription) ||
            !editingDescription
              ? "edit"
              : "done"}
          </span>
        )}
      </div>
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
