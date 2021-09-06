import React, {useContext, useEffect, useState} from "react";
import CardIcon from "../Cart/CartIcon";
import classes from "./HeaderCartButton.module.css";
import CartContext from "../store/cart-context";

const HeaderCartButton = (props) => {
  const cartContext = useContext(CartContext);
  const [buttonHighlited, setButtonHighlited] = useState(false);

  const {items} = cartContext;

  useEffect(() => {
    if(items.length === 0){
      return;
    }
    setButtonHighlited(true);

    const timer = setTimeout(() => {
      setButtonHighlited(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };

  }, [items]);

  const numberOfCartItems = items.reduce((currentNumber, item) => {
    return currentNumber + item.amount;
  }, 0);

  const btnClasses = `${classes.button} ${buttonHighlited ? classes.bump : ''}`;

  return (
    <button className={btnClasses} onClick={props.onClick}>
      <span className={classes.icon}>
        <CardIcon />
      </span>
      <span>Your cart</span>
      <span className={classes.badge}>{numberOfCartItems}</span>
    </button>
  );
};

export default HeaderCartButton;
