import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ItemDetails() {
  const [itemData, setItemData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  const location = useLocation(); // To get item details passed from the dashboard
  const itemId = location.state?.itemId || 1; // Example itemId, default to 1

  useEffect(() => {
    // Hardcoded data as fallback
    const hardcodedData = {
      name: "Laptop",
      price: 999,
      description:
        "This is a high-performance laptop suitable for gaming, programming, and office work. Equipped with the latest processor, plenty of RAM, and an SSD for fast performance.",
      images: [
        "https://via.placeholder.com/300?text=Laptop+Image+1",
        "https://via.placeholder.com/300?text=Laptop+Image+2",
        "https://via.placeholder.com/300?text=Laptop+Image+3",
        "https://via.placeholder.com/300?text=Laptop+Image+4",
        "https://via.placeholder.com/300?text=Laptop+Image+5",
      ],
    };

    // Simulated fetch with Axios
    const fetchItemDetails = async () => {
      try {
        // Uncomment and replace the URL when the backend is ready
        // const response = await axios.get(`https://api.example.com/items/${itemId}`);
        // setItemData(response.data);

        // Using hardcoded data for now
        setItemData(hardcodedData);
      } catch (err) {
        console.error(err);
        setError("Failed to load item details. Please try again.");
        setItemData(hardcodedData); // Fallback to hardcoded data
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      itemData ? (prevIndex + 1) % itemData.images.length : 0
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      itemData
        ? prevIndex === 0
          ? itemData.images.length - 1
          : prevIndex - 1
        : 0
    );
  };

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center text-white bg-[#003C43]">
        <p>{error}</p>
      </div>
    );
  }

  if (!itemData) {
    return (
      <div className="h-screen flex justify-center items-center text-white bg-[#003C43]">
        <p>Loading item details...</p>
      </div>
    );
  }

  return (
    <div className="item-details h-screen flex flex-col bg-[#003C43] text-white">
      {/* Back Button */}
      <div className="p-4">
        <Link
          to="/DashBoard"
          className="text-white text-lg font-bold flex items-center space-x-2"
        >
          <span className="text-2xl">←</span> <span>Back</span>
        </Link>
      </div>

      {/* Item Content */}
      <div className="p-8 flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        {/* Image Slider */}
        <div className="flex-1 flex flex-col items-center space-y-4">
          <div className="relative w-full max-w-lg">
            <img
              src={itemData.images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="rounded-lg shadow-md w-full"
            />
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-[#003C43] px-2 py-1 rounded-full shadow-md"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-[#003C43] px-2 py-1 rounded-full shadow-md"
            >
              →
            </button>
          </div>
          <div className="flex space-x-2">
            {itemData.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-3 rounded-full ${
                  index === currentIndex ? "bg-[#77B0AA]" : "bg-gray-400"
                }`}
              ></button>
            ))}
          </div>
        </div>

        {/* Item Details */}
        <div className="flex-1 text-left space-y-4">
          <h1 className="text-3xl font-bold">{itemData.name}</h1>
          <p className="text-lg">Rs. {itemData.price}</p>
          <p className="text-sm text-gray-300">{itemData.description}</p>
          <button className="bg-[#77B0AA] text-white px-6 py-2 rounded-full text-lg">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
