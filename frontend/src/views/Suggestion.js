import React, { useState, useEffect } from "react";
import TheHeader from "../components/TheHeader";
import SuggestionCard from "../components/SuggestionCard";
import SignatureCard from "../components/SignatureCard";
import styles from "./Suggestion.module.scss";
import moment from "moment";
import { connect } from "react-redux";

const mapStateToProps = (state) => state.userStore;

function Suggestion(props) {
  const [suggestionData, setSuggestion] = useState(null);

  useEffect(() => {
    getSuggestionById();
  }, []);

  async function getSuggestionById() {
    const rawData = await fetch(
      `${process.env.REACT_APP_API_URL}/suggestion/${props.suggestionId}`
    );
    const suggestionData = await rawData.json();
    setSuggestion(suggestionData);
  }

  async function toggleSignature() {
    if (!props.loggedIn) return;
    let updated = suggestionData;
    const alreadySigned = updated.signatures.findIndex(
      (signature) => signature.username === props.username
    );
    if (alreadySigned > -1) {
      updated.signatures.splice(alreadySigned, 1);
    } else {
      const newSignature = {
        username: props.username,
        fullName: props.fullName,
        date: moment().format("MMMM Do YYYY, h:mm"),
      };
      updated.signatures.push(newSignature);
    }
    const rawData = await fetch(
      `${process.env.REACT_APP_API_URL}/suggestion/${props.suggestionId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(updated),
      }
    );
    const updatedSuggestion = await rawData.json();
    setSuggestion(updatedSuggestion);
  }

  return (
    <div className={styles.wrapper}>
      <TheHeader />
      {suggestionData ? (
        <div className={styles.content__container}>
          <SuggestionCard suggestionData={suggestionData} />
          <div
            className={
              props.loggedIn ? styles.signature__button + " fancy" : "disabled"
            }
            onClick={() => toggleSignature()}
          >
            {!props.loggedIn
              ? "Login to support this suggestion"
              : suggestionData.signatures &&
                suggestionData.signatures.some(
                  (signature) => signature.username === props.username
                )
              ? "I changed my mind!"
              : "I back this up!"}
          </div>
          <h2 className={styles.signatures__heading}>
            {suggestionData.signatures && suggestionData.signatures.length
              ? "Signatures which have already backed this suggestion:"
              : "Future signatures will appear here:"}
          </h2>
          <ul>
            {suggestionData.signatures.map((signature) => (
              <SignatureCard signatureData={signature} key={signature._id} />
            ))}
          </ul>
        </div>
      ) : (
        <img alt="Loading..." src={require("../assets/spinner.gif")} />
      )}
    </div>
  );
}

export default connect(mapStateToProps)(Suggestion);
