import { useState } from "react";
import { getAuthToken } from "../firebase";

const useSubmitOrder = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [error, setError] = useState(null);

  const submitOrder = async (userData, cartItems, clearCart) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_URL}/orders.json?auth=${token}`,
        {
          method: "POST",
          body: JSON.stringify({ user: userData, orderedItems: cartItems }),
        }
      );
      if (!response.ok) throw new Error("Failed to submit order. Please try again.");
      setDidSubmit(true);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitOrder, isSubmitting, didSubmit, error };
};

export default useSubmitOrder;
