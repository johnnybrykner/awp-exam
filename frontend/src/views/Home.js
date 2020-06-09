import React, { useState, useEffect } from "react";
import SuggestionCard from "../components/SuggestionCard";
import styles from "./Home.module.scss";
import TheHeader from "../components/TheHeader";
import { Link } from "@reach/router";

export default function Home() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const rawData = await fetch("http://localhost:8080/api/suggestions");
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
    </div>
  );
}
