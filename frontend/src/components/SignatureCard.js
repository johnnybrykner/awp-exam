import React from "react";
import styles from "./SignatureCard.module.scss";

export default function SignatureCard(props) {
  return (
    <div className={styles.signature__container + " fancy"}>
      <section>
        <span className="material-icons">account_circle</span>
        <span
          className={styles.suggestion__user}
        >{`${props.signatureData.fullName} (${props.signatureData.username})`}</span>
      </section>
      <section>
        <span className="material-icons">schedule</span>
        <span className={styles.suggestion__date}>
          {props.signatureData.date}
        </span>
      </section>
    </div>
  );
}
