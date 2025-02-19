import { useState } from "react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Item 1", price: 12, rating: 4.5, quantity: 1 },
    { id: 2, name: "Item 2", price: 45, rating: 4.5, quantity: 1 },
    { id: 3, name: "Item 3", price: 24, rating: 4.5, quantity: 1 },
    { id: 4, name: "Item 4", price: 30, rating: 4.5, quantity: 1 },
  ]);

  const handleIncreaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleDecreaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const getSubTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-page p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="cart-item border border-gray-300 rounded-lg p-4 mb-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="item-info flex items-center justify-between">
                <div className="item-image">
                  {/* Placeholder for the item image */}
                  <img
                    src={`https://via.placeholder.com/80`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
                <div className="item-details ml-4 flex-grow">
                  <h2 className="text-xl font-medium text-gray-900">{item.name}</h2>
                  <div className="rating text-yellow-500 text-sm">{`⭐ ${item.rating}`}</div>
                  <p className="text-gray-600 text-lg">${item.price}</p>
                </div>

                <div className="quantity-controls flex items-center space-x-4">
                  <button
                    onClick={() => handleDecreaseQuantity(item.id)}
                    className="bg-gray-300 text-lg rounded-full w-8 h-8 flex items-center justify-center text-gray-600"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleIncreaseQuantity(item.id)}
                    className="bg-gray-300 text-lg rounded-full w-8 h-8 flex items-center justify-center text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="subtotal flex justify-between items-center mt-4 p-4 border-t border-gray-300 bg-white rounded-lg shadow-md">
        <h3 className="font-semibold text-xl text-gray-800">Sub Total</h3>
        <p className="text-xl font-bold text-gray-900">${getSubTotal().toFixed(2)}</p>
      </div>

      <div className="total flex justify-between items-center mt-4 p-4 bg-white border-t border-gray-300 rounded-lg shadow-md">
        <h3 className="font-semibold text-xl text-gray-800">TOTAL</h3>
        <p className="text-2xl font-bold text-gray-900">${getSubTotal().toFixed(2)}</p>
      </div>

      <div className="checkout mt-6">
        <button className="w-full bg-green-500 text-white py-3 rounded-lg text-xl hover:bg-green-600 transition-all duration-300">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
