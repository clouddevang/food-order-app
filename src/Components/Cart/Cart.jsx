import React, { useContext, useState } from "react";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import { CartStateContext, CartDispatchContext } from "../../store/cart-context";
import Checkout from "./Checkout";
import useSubmitOrder from "../../hooks/useSubmitOrder";

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const cartState = useContext(CartStateContext);
  const cartDispatch = useContext(CartDispatchContext);
  const { submitOrder, isSubmitting, didSubmit, error } = useSubmitOrder();

  const totalAmount = `$${cartState.totalAmount.toFixed(2)}`;
  const hasItems = cartState.items.length > 0;

  const cartItemRemoveHandler = (id) => cartDispatch.removeItem(id);
  const cartItemAddHandler = (item) => cartDispatch.addItem({ ...item, amount: 1 });

  const submitOrderHandler = (userData) => {
    setPendingOrder({ userData, cartItems: cartState.items });
    submitOrder(userData, cartState.items, cartDispatch.clearCart);
  };

  const retryHandler = () => {
    submitOrder(pendingOrder.userData, pendingOrder.cartItems, cartDispatch.clearCart);
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartState.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={() => setIsCheckout(true)}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {!hasItems && <p style={{ textAlign: "center" }}>Your cart is empty.</p>}
      {hasItems && cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending order data...</p>;

  const didSubmitModalContent = (
    <React.Fragment>
      <p>Successfully sent the order!</p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.onClose}>
          Close
        </button>
      </div>
    </React.Fragment>
  );

  const errorModalContent = (
    <React.Fragment>
      <p>{error}</p>
      <div className={classes.actions}>
        <button className={classes["button--alt"]} onClick={props.onClose}>
          Close
        </button>
        <button className={classes.button} onClick={retryHandler}>
          Retry
        </button>
      </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && !error && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
      {!isSubmitting && error && errorModalContent}
    </Modal>
  );
};

export default Cart;
