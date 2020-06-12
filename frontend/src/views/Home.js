import React, { useState, useEffect } from "react";
import SuggestionCard from "../components/SuggestionCard";
import SuggestionForm from "../components/SuggestionForm";
import { CSSTransition } from "react-transition-group";
import styles from "./Home.module.scss";
import TheHeader from "../components/TheHeader";
import { Link } from "@reach/router";

export default function Home() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestionDrawer, toggleSuggestionDrawer] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const rawData = await fetch(`${process.env.REACT_APP_API_URL}/suggestions`);
    const suggestionsData = await rawData.json();
    setLoading(false);
    setSuggestions(suggestionsData);
  }

  return (
    <div className={styles.wrapper}>
      <TheHeader />
      {suggestions.length ? (
        suggestions.map((suggestion) => (
          <Link key={suggestion._id} to={`/suggestion/${suggestion._id}`}>
            <SuggestionCard showAdminActions suggestionData={suggestion} />
          </Link>
        ))
      ) : loading ? (
        <img alt="Loading..." src={require("../assets/spinner.gif")} />
      ) : (
        <span className={styles.empty__header}>
          There are no suggestions yet, you can add one with the button below
        </span>
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
          requestDataRefresh={() => fetchData()}
        />
      </CSSTransition>
    </div>
  );
}
