// src/components/ZealCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ZealCard = ({ product }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 m-4">
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{product.eventName}</h3>
                <p className="text-gray-600 mt-1">{product.eventDate}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">{product.eventTime}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">{product.location}</p>
            </div>
        </div>
    );
};

export default ZealCard;
