import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import logo from "../../assets/logo1.svg";
import cartIcon from "../../assets/cart.svg";
import accountIcon from "../../assets/account.svg";

export default function DashBoard() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]); // Dynamic categories
  const [items, setItems] = useState({}); // Dynamic items per category
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  // Hardcoded fallback data
  const hardcodedCategories = [
    { name: "Electronics", icon: "📱" },
    { name: "Clothing", icon: "👗" },
    { name: "Books", icon: "📚" },
    { name: "Accessories", icon: "👜" },
  ];

  const hardcodedItems = {
    Electronics: [
      { name: "Laptop", description: "High performance laptop", price: 999 },
      { name: "Mobile Phone", description: "Latest model mobile", price: 499 },
      { name: "Headphones", description: "Noise-canceling headphones", price: 99 },
    ],
    Clothing: [
      { name: "T-Shirt", description: "Cotton t-shirt", price: 19 },
      { name: "Jeans", description: "Denim jeans", price: 49 },
      { name: "Jacket", description: "Winter jacket", price: 79 },
    ],
    Books: [
      { name: "React Guide", description: "Complete React JS guide", price: 29 },
      { name: "JavaScript Handbook", description: "JavaScript programming book", price: 19 },
      { name: "CSS Mastery", description: "Learn CSS for modern web", price: 24 },
    ],
    Accessories: [
      { name: "Bag", description: "Leather bag", price: 39 },
      { name: "Watch", description: "Luxury wristwatch", price: 59 },
      { name: "Sunglasses", description: "Stylish sunglasses", price: 29 },
    ],
  };

  // Fetch categories and items from the backend
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/categories") // Replace with your backend endpoint
      .then((response) => {
        setCategories(response.data.categories || hardcodedCategories); // Fallback to hardcoded categories
        setItems(response.data.items || hardcodedItems); // Fallback to hardcoded items
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories and items:", error);
        setCategories(hardcodedCategories); // Fallback in case of error
        setItems(hardcodedItems); // Fallback in case of error
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage("category");
  };

  const handleSeeDetailsClick = (item) => {
    navigate("/item-details", { state: { item } });
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-[#77B0AA] via-[#135D66] to-[#003C43] text-white">
      {/* Navbar */}
      <div className="bg-white text-[#003C43] flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="logo" className="h-10" />
          <input
            type="text"
            placeholder="Search..."
            className="w-80 border border-gray-300 rounded-full px-4 py-2 outline-none text-sm focus:ring-2 focus:ring-[#77B0AA]"
          />
          <button className="bg-[#77B0AA] text-white px-4 py-2 rounded-full text-sm">
            Search
          </button>
        </div>
        <div className="flex items-center space-x-6 text-sm font-medium">
          <button>
            <img src={cartIcon} alt="Cart Icon" className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <img src={accountIcon} alt="Account Icon" className="h-6 w-6" />
            <span>Laiba Durrani</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {loading ? (
          <p>Loading...</p>
        ) : currentPage === "dashboard" ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <div
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className="bg-white text-[#003C43] rounded-lg shadow-lg p-6 flex flex-col items-center hover:scale-105 transform transition duration-300 ease-in-out cursor-pointer"
                >
                  <div className="text-4xl mb-4">{category.icon || "📦"}</div>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Explore the latest in {category.name}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Back Button */}
            <div className="p-4">
              <button
                onClick={() => setCurrentPage("dashboard")}
                className="text-white text-lg font-bold flex items-center space-x-2"
              >
                <span className="text-2xl">←</span> <span>Back</span>
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-6">{selectedCategory} Items</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {items[selectedCategory]?.length > 0 ? (
                items[selectedCategory].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white text-[#003C43] rounded-lg shadow-lg p-4 flex flex-col items-center hover:scale-105 transform transition duration-300 ease-in-out"
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/70"}
                      alt={item.name}
                      className="h-32 w-32 object-cover mb-4 flex-shrink-0"
                    />
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600">Rs. {item.price}</p>
                    <button
                      onClick={() => handleSeeDetailsClick(item)}
                      className="bg-[#77B0AA] text-white px-4 py-2 rounded-full text-sm mt-4"
                    >
                      See Details
                    </button>
                  </div>
                ))
              ) : (
                <p>No items found for this category.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
