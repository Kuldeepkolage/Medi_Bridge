import React, { useState } from "react";
import BookList from "./BookLists";
import BookSearch from "./BookSearch";
import BookForm from "./BookForm";
import PurchaseList from "./PurchaseList";
import BuyBook from "./BookPurchase";

const LibManagement = () => {
    const [books, setBooks] = useState([]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 ">Library Management System</h1>

            <BookForm onBookAdded={(newBook) => setBooks((prev) => [...prev, newBook])} />

            <BookSearch />

            <BookList />
            <BuyBook /> 
            

            <PurchaseList />
        </div>
    );
};

export default LibManagement;
