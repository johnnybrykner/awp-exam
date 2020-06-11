import React, { useState, useEffect } from "react";
import SuggestionCard from "../components/SuggestionCard";
import SuggestionForm from "../components/SuggestionForm";
import { CSSTransition } from "react-transition-group";
import styles from "./Home.module.scss";
import TheHeader from "../components/TheHeader";
import { Link } from "@reach/router";

export default function Home() {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionDrawer, toggleSuggestionDrawer] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const rawData = await fetch(`${process.env.REACT_APP_API_URL}/suggestions`);
    const suggestionsData = await rawData.json();
    setSuggestions(suggestionsData);
  }

  return (
    <div className={styles.wrapper}>
      <TheHeader />
      {suggestions.length ? (
        suggestions.map((suggestion) => (
          <Link key={suggestion._id} to={`/suggestion/${suggestion._id}`}>
            <SuggestionCard suggestionData={suggestion} />
          </Link>
        ))
      ) : (
        <img alt="Loading..." src={require("../assets/spinner.gif")} />
      )}
      <span
        className={styles.suggestion__add + " material-icons"}
        onClick={() => toggleSuggestionDrawer(!suggestionDrawer)}
      >
        add_box
      </span>
      <CSSTransition
        in={suggestionDrawer}
        timeout={300}
        unmountOnExit
        classNames="slide"
      >
        <SuggestionForm
          closeSuggestionDrawer={() => toggleSuggestionDrawer(false)}
        />
      </CSSTransition>
    </div>
  );
}
