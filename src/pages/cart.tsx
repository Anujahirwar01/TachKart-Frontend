import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemComponent from "../components/cart-item";
import { addToCartRequest, calculatePrice, removeCartItem } from "../redux/reducer/cartReducer";
import type { CartReducerInitialState } from "../types/reducer-types";
import axios from "axios";
import { server } from "../redux/store";
import type { CartItem } from "../types/types";
import { discountApplied } from "../redux/reducer/cartReducer";


const Cart = () => {

  const {
    cartItems, subtotal, tax, shippingCharges, discount, total
  } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer)

  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) {
      return;
    }
    dispatch(addToCartRequest({ ...cartItem, quantity: cartItem.quantity + 1 }));
  }
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity > 1) {
      dispatch(addToCartRequest({ ...cartItem, quantity: cartItem.quantity - 1 }));
    } else {
      dispatch(removeCartItem(cartItem.productId));
    }
  }
  const removeHandler = (cartItem: CartItem) => {
    dispatch(removeCartItem(cartItem.productId));
  }

  useEffect(() => {
    const {token:cancelToken,cancel} = axios.CancelToken.source();
    const timeOutID = setTimeout(() => {
      if (!couponCode) {
        dispatch(discountApplied(0));
        dispatch(calculatePrice());
        setIsValidCouponCode(false);
        return;
      }

      axios.get(`${server}/api/v1/payment/discount?code=${couponCode}`,{
        cancelToken
      }).then((res) => {
        dispatch(discountApplied(res.data.discount));
        dispatch(calculatePrice());
        setIsValidCouponCode(true);
      }).catch(() => {
        dispatch(discountApplied(0));
        dispatch(calculatePrice());
        setIsValidCouponCode(false);
      })
    }, 1000);
    return () => {
      clearTimeout(timeOutID);
      cancel();
      setIsValidCouponCode(false);
    }
  }, [couponCode, dispatch])

  return (
    <div className="cart">
      <main>
        {
          cartItems.length > 0 ? (
            cartItems.map((i, index) => (
              <CartItemComponent
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                removeHandler={removeHandler}
                key={index} cartItem={i} />
            ))
          ) : (
            <h2>Your cart is empty</h2>
          )
        }
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em>
            ₹{discount}
          </em>
        </p>
        <p><b>Total: ₹{total}</b></p>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
        />
        {
          couponCode && (
            isValidCouponCode ? (
              <span className="green">
                ₹{discount} off using the <code>{couponCode}</code>
              </span>
            ) : (
              <span className="red">
                <VscError /> Invalid Coupon Code
              </span>
            )
          )
        }
        {
          cartItems.length > 0 && (
            <Link to="/shipping">
              <button>Checkout</button>
            </Link>
          )
        }
      </aside>
    </div>
  )
}

export default Cart