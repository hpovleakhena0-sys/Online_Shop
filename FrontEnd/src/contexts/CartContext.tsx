import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product, ProductColor } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; selectedSize?: string; selectedColor?: ProductColor } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; selectedSize?: string; selectedColor?: ProductColor } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; selectedSize?: string; selectedColor?: ProductColor } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: ProductColor) => void;
  removeItem: (productId: string, selectedSize?: string, selectedColor?: ProductColor) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: ProductColor) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getItemKey = (productId: string, selectedSize?: string, selectedColor?: ProductColor) => {
  return `${productId}-${selectedSize || 'none'}-${selectedColor?.name || 'none'}`;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, selectedSize, selectedColor } = action.payload;
      const existingIndex = state.items.findIndex(
        item => 
          item.product.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor?.name === selectedColor?.name
      );

      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += quantity;
        return { ...state, items: newItems, isOpen: true };
      }

      return {
        ...state,
        items: [...state.items, { product, quantity, selectedSize, selectedColor }],
        isOpen: true,
      };
    }

    case 'REMOVE_ITEM': {
      const { productId, selectedSize, selectedColor } = action.payload;
      return {
        ...state,
        items: state.items.filter(
          item => 
            !(item.product.id === productId && 
              item.selectedSize === selectedSize && 
              item.selectedColor?.name === selectedColor?.name)
        ),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity, selectedSize, selectedColor } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            item => 
              !(item.product.id === productId && 
                item.selectedSize === selectedSize && 
                item.selectedColor?.name === selectedColor?.name)
          ),
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === productId && 
          item.selectedSize === selectedSize && 
          item.selectedColor?.name === selectedColor?.name
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };

    case 'LOAD_CART':
      return { ...state, items: action.payload };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Failed to load cart from localStorage');
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product, quantity = 1, selectedSize?: string, selectedColor?: ProductColor) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selectedSize, selectedColor } });
  };

  const removeItem = (productId: string, selectedSize?: string, selectedColor?: ProductColor) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, selectedSize, selectedColor } });
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string, selectedColor?: ProductColor) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity, selectedSize, selectedColor } });
  };

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const setCartOpen = (open: boolean) => dispatch({ type: 'SET_CART_OPEN', payload: open });

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        setCartOpen,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
