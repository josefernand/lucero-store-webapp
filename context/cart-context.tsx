'use client';

import { ActionType, CartState, Product } from '@/ts';
import { createContext, useReducer, useContext, useEffect, useState } from 'react';

// Define the action types
type Action =
  | { type: ActionType.LOAD_CART; payload: CartState }
  | { type: ActionType.ADD_TO_CART; payload: Product }
  | { type: ActionType.REMOVE_FROM_CART; payload: { id: string } }
  | { type: ActionType.REMOVE_ALL_FROM_CART; payload: { id: string } }
  | { type: ActionType.CLEAR_CART }
  | { type: ActionType.SEND_ORDER };

// Define the initial state
const initialState: CartState = {
  loading: true,
  count: 0,
  items: [],
  total: 0,
  sent: false,
  showCart: false
};

// Create a context
const CartContext = createContext<
  { state: CartState; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

// Define a reducer function to handle state changes
const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case ActionType.LOAD_CART:
      return {
        ...state,
        ...action.payload,
        loading: false
      };
    case ActionType.ADD_TO_CART: {
      const item = state.items.find((item) => item.product.id === action.payload.id);
      return {
        ...state,
        count: state.count + 1,
        items: item
          ? state.items.map((item) =>
              item.product.id === action.payload.id
                ? { ...item, quantity: item.quantity + 1, total: item.total + action.payload.price }
                : item
            )
          : [...state.items, { product: action.payload, quantity: 1, total: action.payload.price }],
        total: state.total + action.payload.price
      };
    }
    case ActionType.REMOVE_FROM_CART: {
      const index = state.items.findIndex((item) => item.product.id === action.payload.id);
      if (index === -1) return state;
      const item = state.items[index];
      if (item.quantity === 1) {
        return {
          ...state,
          count: state.count - 1,
          items: state.items.filter((item) => item.product.id !== action.payload.id),
          total: state.total - item.total
        };
      } else {
        return {
          ...state,
          count: state.count - 1,
          items: state.items.map((item, i) =>
            i === index
              ? { ...item, quantity: item.quantity - 1, total: item.total - item.product.price }
              : item
          ),
          total: state.total - item.product.price
        };
      }
    }
    case ActionType.REMOVE_ALL_FROM_CART: {
      const item = state.items.find((item) => item.product.id === action.payload.id);
      return {
        ...state,
        count: state.count - (item ? item.quantity : 0),
        items: state.items.filter((item) => item.product.id !== action.payload.id),
        total: state.total - (item ? item.total : 0)
      };
    }
    case ActionType.CLEAR_CART:
      console.log('clearing cart');
      return {
        ...initialState,
        loading: false
      };
    default:
      return state;
  }
};

// Create a custom provider component
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart state from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: ActionType.LOAD_CART, payload: JSON.parse(savedCart) });
    } else {
      dispatch({ type: ActionType.LOAD_CART, payload: initialState });
    }
  }, []);

  // Save cart state to localStorage whenever it changes
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem('cart', JSON.stringify(state));
    }
  }, [state]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
