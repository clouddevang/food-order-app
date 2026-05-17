import { useContext } from "react";

import MealItemForm from "./MealItemForm";
import classes from "./MealItem.module.css";
import { CartDispatchContext } from "../../../store/cart-context";

const AMOUNT_MIN = 1;
const AMOUNT_MAX = 5;

const MealItem = (props) => {
  const { addItem } = useContext(CartDispatchContext);
  const price = `$${props.price.toFixed(2)}`;

  const addToCartHandler = (amount) => {
    addItem({ id: props.id, name: props.name, amount, price: props.price });
  };

  return (
    <li className={classes.meal}>
      <div>
        <h3>{props.name}</h3>
        <div className={classes.description}>{props.description}</div>
        <div className={classes.price}>{price}</div>
      </div>
      <div>
        <MealItemForm
          id={props.id}
          onAddToCart={addToCartHandler}
          min={AMOUNT_MIN}
          max={AMOUNT_MAX}
        />
      </div>
    </li>
  );
};

export default MealItem;
