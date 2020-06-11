import React from "react";
import styles from "./SuggestionCard.module.scss";

export default function SuggestionCard(props) {
  function toggleVisibility(event) {
    event.preventDefault();
  }

  return (
    <div className={styles.suggestion__container + " fancy"}>
      <div className={styles.suggestion__header}>
        <div
          className={styles.suggestion__visibility}
          onClick={(event) => toggleVisibility(event)}
        >
          <span>Suggestion visible:</span>
          <input
            type="checkbox"
            name="visibility"
            checked={props.suggestionData.visibility}
          />
        </div>
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
      <h2 className={styles.suggestion__title}>{props.suggestionData.title}</h2>
      <p className={styles.suggestion__description}>
        {props.suggestionData.description}
      </p>
      <span className={styles.suggestion_signatures}>
        {props.suggestionData.signatures &&
        props.suggestionData.signatures.length
          ? `${props.suggestionData.signatures.length} signature(s) supporting this suggestion`
          : "There are no signatures"}
      </span>
    </div>
  );
}
