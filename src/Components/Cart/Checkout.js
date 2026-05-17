import { useState } from "react";

import classes from "./Checkout.module.css";

const isEmpty = (value) => value.trim() === "";
const isFiveChars = (value) => value.trim().length === 5;

const INITIAL_FIELDS = { name: "", street: "", postalCode: "", city: "" };
const INITIAL_TOUCHED = { name: false, street: false, postalCode: false, city: false };

const Checkout = (props) => {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);

  const validity = {
    name: !isEmpty(fields.name),
    street: !isEmpty(fields.street),
    postalCode: isFiveChars(fields.postalCode),
    city: !isEmpty(fields.city),
  };

  const showError = {
    name: touched.name && !validity.name,
    street: touched.street && !validity.street,
    postalCode: touched.postalCode && !validity.postalCode,
    city: touched.city && !validity.city,
  };

  const handleChange = (field) => (e) =>
    setFields((prev) => ({ ...prev, [field]: e.target.value }));

  const handleBlur = (field) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const confirmHandler = (event) => {
    event.preventDefault();
    setTouched({ name: true, street: true, postalCode: true, city: true });

    const formIsValid = Object.values(validity).every(Boolean);
    if (!formIsValid) return;

    props.onConfirm(fields);
  };

  const controlClass = (field) =>
    `${classes.control} ${showError[field] ? classes.invalid : ""}`;

  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={controlClass("name")}>
        <label htmlFor="name">Your Name</label>
        <input
          type="text"
          id="name"
          value={fields.name}
          onChange={handleChange("name")}
          onBlur={handleBlur("name")}
        />
        {showError.name && <p>Please enter a valid name!</p>}
      </div>
      <div className={controlClass("street")}>
        <label htmlFor="street">Street</label>
        <input
          type="text"
          id="street"
          value={fields.street}
          onChange={handleChange("street")}
          onBlur={handleBlur("street")}
        />
        {showError.street && <p>Please enter a valid street!</p>}
      </div>
      <div className={controlClass("postalCode")}>
        <label htmlFor="postal">Postal Code</label>
        <input
          type="text"
          id="postal"
          value={fields.postalCode}
          onChange={handleChange("postalCode")}
          onBlur={handleBlur("postalCode")}
        />
        {showError.postalCode && (
          <p>Please enter a valid postal code (5 characters long)!</p>
        )}
      </div>
      <div className={controlClass("city")}>
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          value={fields.city}
          onChange={handleChange("city")}
          onBlur={handleBlur("city")}
        />
        {showError.city && <p>Please enter a valid city!</p>}
      </div>
      <div className={classes.actions}>
        <button type="button" onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;
