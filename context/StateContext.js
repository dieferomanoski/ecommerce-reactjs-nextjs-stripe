import React, { createContext, useContext, useState, useEffect } from 'react';

import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({children}) => {
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    let foundProduct;
    let index;


    const onAddProduct = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);
        
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
        
        if(checkProductInCart) {
          const updatedCartItems = cartItems.map((cartProduct) => {
            if(cartProduct._id === product._id) return {
              ...cartProduct,
              quantity: cartProduct.quantity + quantity
            }
          })
    
          setCartItems(updatedCartItems);
        } else {
          product.quantity = quantity;
          
          setCartItems([...cartItems, { ...product }]);
        }
    
        toast.success(`${quantity} ${product.name} adicionado ao carrinho.`)
      } 
    
    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id);
    
        setTotalPrice((prevTotalPrice) => prevTotalPrice -foundProduct.price * foundProduct.quantity);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);
      }

      const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id);
        
        const newCardItems = cartItems;
    
        if(value === 'inc') {
          newCardItems.map((item) => (item._id === id) && (item.quantity = foundProduct.quantity + 1));
          setCartItems([...newCardItems]);
          setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
          setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
        } else if(value === 'dec') {
          if (foundProduct.quantity > 1) {
            newCardItems.map((item) => (item._id === id) && (item.quantity = foundProduct.quantity - 1));
            setCartItems([...newCardItems]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
          }
        }
      }
      

    const increaseQuantity = () => {
        setQuantity((prevQuantity)=> prevQuantity + 1 );
    }

    const decreaseQuantity = () => {
        setQuantity((prevQuantity)=> {
            if((prevQuantity - 1) < 1) return 1;
            return prevQuantity - 1;
        } );
    }

    return (
        <Context.Provider 
        value={{
            setShowCart,
            showCart,
            cartItems,
            totalPrice,
            totalQuantities,
            quantity,
            increaseQuantity,
            decreaseQuantity,
            onAddProduct,
            onRemove,
            toggleCartItemQuantity

        }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);