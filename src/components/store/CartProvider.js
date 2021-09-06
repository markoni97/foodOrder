import React, { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD_ITEM") {
    const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount;
    //Looking to find the index of the item if it already exists
    const existingCartItemIndex = state.items.findIndex(item => {
      return item.id === action.item.id;
    });
    //If the item exists we store it in another constant
    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;

    //So if the item exists
    if(existingCartItem){
      //We create a new item where the amount is updated
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount
      };
      //Then we copy the state items array
      updatedItems = [...state.items];
      //And set the item that already exists in the array to an updated item
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }
    return { items: updatedItems, totalAmount: updatedTotalAmount };
  }

  if(action.type === 'REMOVE_ITEM'){
    const existingCartItemIndex = state.items.findIndex(item => {
      return item.id === action.id;
    });
    const existingItem = state.items[existingCartItemIndex];
    let updatedTotalAmount = state.totalAmount - existingItem.price;
    if(updatedTotalAmount < 0){
      updatedTotalAmount = 0;
    }
    let updatedItems;
    if(existingItem.amount === 1){
      updatedItems = state.items.filter(item => {
        return action.id !== item.id;
      });
    } else {
      const updatedItem = {...existingItem, amount: existingItem.amount - 1};
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    return { items: updatedItems, totalAmount: updatedTotalAmount };
  }
  if(action.type === 'RESET'){
    return defaultCartState;
  }

  return defaultCartState;
};

const CardProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemHandler = (item) => {
    dispatchCartAction({ type: "ADD_ITEM", item: item });
  };

  const removeItemHandler = (id) => {
    dispatchCartAction({ type: "REMOVE_ITEM", id: id });
  };

  const resetCartHandler = () => {
    dispatchCartAction({type: 'RESET'});
  }

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemHandler,
    removeItem: removeItemHandler,
    resetCart: resetCartHandler
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CardProvider;
