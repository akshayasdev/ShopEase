import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const CartContext = createContext();

/* =================================
   LOAD CART FROM LOCAL STORAGE
================================= */

function getSavedCart() {
  try {
    const savedCart =
      localStorage.getItem("shopeaseCart");

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  } catch (error) {
    console.error(
      "Error loading cart:",
      error
    );

    return [];
  }
}

/* =================================
   CART PROVIDER
================================= */

export function CartProvider({ children }) {
  const [cartItems, setCartItems] =
    useState(getSavedCart);

  /* =================================
     SAVE CART TO LOCAL STORAGE
  ================================= */

  useEffect(() => {
    localStorage.setItem(
      "shopeaseCart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  /* =================================
     REFRESH STOCK FROM BACKEND
  ================================= */

  useEffect(() => {
    const refreshCartStock = async () => {
      if (cartItems.length === 0) {
        return;
      }

      try {
        const updatedItems =
          await Promise.all(
            cartItems.map(async (item) => {
              try {
                const response =
                  await axios.get(
                    `http://localhost:5000/api/products/${item._id}`
                  );

                const latestProduct =
                  response.data;

                /* Product no longer exists */
                if (!latestProduct) {
                  return null;
                }

                /* Product is out of stock */
                if (
                  latestProduct.stock <= 0
                ) {
                  return null;
                }

                /*
                  Keep the latest product data
                  but preserve the cart quantity.
                */

                return {
                  ...latestProduct,
                  quantity: Math.min(
                    item.quantity,
                    latestProduct.stock
                  ),
                };
              } catch (error) {
                console.error(
                  `Unable to refresh ${item.name}:`,
                  error
                );

                /*
                  If the backend request fails,
                  keep the existing cart item.
                */

                return item;
              }
            })
          );

        const validItems =
          updatedItems.filter(
            (item) => item !== null
          );

        setCartItems(validItems);
      } catch (error) {
        console.error(
          "Error refreshing cart stock:",
          error
        );
      }
    };

    refreshCartStock();

    /* =================================
       REFRESH WHEN TAB GETS FOCUS
    ================================= */

    const handleFocus = () => {
      refreshCartStock();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);

  /* =================================
     ADD PRODUCT TO CART
  ================================= */

  const addToCart = (product) => {
    setCartItems((currentItems) => {

      /* ================================
         PRODUCT ALREADY IN CART
      ================================= */

      const existingItem =
        currentItems.find(
          (item) =>
            item._id === product._id
        );

      if (existingItem) {

        /*
          Do not allow quantity above
          available stock.
        */

        if (
          existingItem.quantity >=
          product.stock
        ) {
          return currentItems;
        }

        return currentItems.map(
          (item) =>
            item._id === product._id
              ? {
                  ...item,
                  ...product,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      }

      /* ================================
         PRODUCT OUT OF STOCK
      ================================= */

      if (
        !product.stock ||
        product.stock <= 0
      ) {
        return currentItems;
      }

      /* ================================
         ADD NEW PRODUCT
      ================================= */

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  /* =================================
     REMOVE PRODUCT
  ================================= */

  const removeFromCart = (
    productId
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item._id !== productId
        )
    );
  };

  /* =================================
     INCREASE QUANTITY
  ================================= */

  const increaseQuantity = (
    productId
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems.map((item) => {

          if (
            item._id !== productId
          ) {
            return item;
          }

          /*
            Do not exceed current
            available stock.
          */

          if (
            item.quantity >=
            item.stock
          ) {
            return item;
          }

          return {
            ...item,
            quantity:
              item.quantity + 1,
          };
        })
    );
  };

  /* =================================
     DECREASE QUANTITY
  ================================= */

  const decreaseQuantity = (
    productId
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems
          .map((item) =>
            item._id === productId
              ? {
                  ...item,
                  quantity:
                    item.quantity - 1,
                }
              : item
          )
          .filter(
            (item) =>
              item.quantity > 0
          )
    );
  };

  /* =================================
     CART COUNT
  ================================= */

  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  /* =================================
     CART TOTAL
  ================================= */

  const cartTotal =
    cartItems.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );

  /* =================================
     CLEAR CART
  ================================= */

  const clearCart = () => {
    setCartItems([]);
  };

  /* =================================
     CONTEXT
  ================================= */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =================================
   USE CART
================================= */

export function useCart() {
  return useContext(CartContext);
}