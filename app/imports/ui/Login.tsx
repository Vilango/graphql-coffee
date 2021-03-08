import { Meteor } from "meteor/meteor";
import React, { Fragment, useState, useEffect } from "react";
import { validateEmail } from "../common";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState();

  const [emailValid, setEmailValid] = useState(false);

  const [requestedToken, setRequestedToken] = useState(false);

  useEffect(() => {
    const isEmailValid = validateEmail(email);
    console.log("checking E-Mail", isEmailValid, email);
    setEmailValid(isEmailValid);
  }, [email]);

  const requestTokenWithEmail = (event) => {
    console.log("email", email);
    event.preventDefault();
    if (!emailValid) {
      setError("Not a valid e-mail address. Please enter a valid one!");
      return;
    }

    Meteor.call("requestTokenWithEmail", email, (err, res) => {
      setError(undefined);

      if (err) {
        setError(err);
      } else {
        // success!
        setRequestedToken(true);
      }
    });
  };

  const RequestForm = (
    <Fragment>
      <p>To receive your usertoken please enter your email address below:</p>
      <form onSubmit={requestTokenWithEmail}>
        <label>
          E-Mail&nbsp;
          <input
            type="text"
            value={email}
            onChange={(event) => {
              // console.log("event", event);
              setEmail(event?.target?.value);
            }}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </Fragment>
  );

  const RequestedInfo = (
    <div>You should receive an email ({email}) with your usertoken shortly</div>
  );

  return (
    <div>
      {requestedToken ? RequestedInfo : RequestForm}

      {error ? (
        <div style={{ color: "red" }}>{JSON.stringify(error, null, "\n")}</div>
      ) : null}
    </div>
  );
};
