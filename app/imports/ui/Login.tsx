import { Meteor } from "meteor/meteor";
import React, { Fragment, useState } from "react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState();
  const [requestedToken, setRequestedToken] = useState(false);

  const requestTokenWithEmail = (event) => {
    console.log("email", email);

    Meteor.call("requestTokenWithEmail", email, (err, res) => {
      setError(undefined);

      if (err) {
        setError(err);
      } else {
        // success!
        setRequestedToken(true);
      }
    });
    event.preventDefault();
  };

  const RequestForm = (
    <Fragment>
    <p>To receive your usertoken please enter your email address below:</p>
    <form onSubmit={requestTokenWithEmail}>
      <label>
        Name:
        <input
          type="text"
          value={email}
          onChange={(event) => {
            console.log("event", event);
            setEmail(event?.target?.value);
          }}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
    </Fragment>
  );

  const RequestedInfo = (
    <div>
      You should receive an email ({email}) with your usertoken shortly
    </div>

  )

  return (
    <div>


      {requestedToken ? RequestedInfo : RequestForm}

      {error ? <div>{JSON.stringify(error, null, "\n")}</div> : null}
    </div>
  );
};
