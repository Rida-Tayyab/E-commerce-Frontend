import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/product/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error fetching product:", err));

    fetch(`http://localhost:5000/reviews?product=${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [id]);

  if (!product) return <div className="p-6">Loading...</div>;

  const fullStars = Math.floor(product.rating || 0);
  const emptyStars = 5 - fullStars;

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Image */}
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="rounded-xl shadow-lg"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-1 text-yellow-400">
            {Array.from({ length: fullStars }).map((_, i) => (
              <Star key={i} fill="currentColor" className="w-5 h-5" />
            ))}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <Star key={i} className="w-5 h-5 text-gray-300" />
            ))}
          </div>
          <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
          <p className="text-gray-500 text-sm">{product.category}</p>
          <p className="mt-4 text-gray-700">{product.description}</p>
        </div>

        <div className="flex gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
            Pay ${product.price}
          </Button>
          <Button variant="outline">Preview</Button>
        </div>

        <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
          <li>Store: {product.store?.name || "Unknown Store"}</li>
          <li>{product.reviewCount} customer reviews</li>
          <li>Rating: {product.rating.toFixed(1)} / 5</li>
        </ul>

        <div className="text-sm text-gray-500">
          <strong>License:</strong> For personal and professional use. You
          cannot resell or redistribute this product in its original or modified
          state.
        </div>
      </div>

      {/* Reviews Section */}
      <div className="col-span-2">
        <h2 className="text-xl font-semibold mt-10 mb-4">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, idx) => {
              const full = Math.floor(review.rating);
              const empty = 5 - full;
              const date = new Date(review.createdAt).toLocaleDateString();
              return (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{review.user?.name || "Anonymous"}</h3>
                        <p className="text-sm text-gray-500">{date}</p>
                      </div>
                      <div className="flex gap-1 text-yellow-400">
                        {Array.from({ length: full }).map((_, i) => (
                          <Star key={i} fill="currentColor" className="w-4 h-4" />
                        ))}
                        {Array.from({ length: empty }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-gray-300" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{review.review}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
