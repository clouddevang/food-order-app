import { useContext, useEffect, useState } from "react";

import CartIcon from "../Cart/CartIcon";
import { CartStateContext } from "../../store/cart-context";
import classes from "./HeaderCartButton.module.css";

const HeaderCartButton = (props) => {
  const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);
  const { items } = useContext(CartStateContext);

  const numberOfCartItems = items.reduce((total, item) => total + item.amount, 0);

  const btnClasses = `${classes.button} ${btnIsHighlighted ? classes.bump : ""}`;

  useEffect(() => {
    if (items.length === 0) return;
    setBtnIsHighlighted(true);
    const timer = setTimeout(() => setBtnIsHighlighted(false), 300);
    return () => clearTimeout(timer);
  }, [items]);

  return (
    <button
      className={btnClasses}
      onClick={props.onClick}
      aria-label={`Your Cart, ${numberOfCartItems} item${numberOfCartItems !== 1 ? "s" : ""}`}
    >
      <span className={classes.icon}>
        <CartIcon />
      </span>
      <span>Your Cart</span>
      <span className={classes.badge}>{numberOfCartItems}</span>
    </button>
  );
};

export default HeaderCartButton;
