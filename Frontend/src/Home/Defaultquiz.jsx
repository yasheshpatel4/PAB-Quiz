// App.js
import React from 'react';

const Defaultquiz = () => {
    const renderCards = () => {
        const cards = Array(9).fill(null).map((_, index) => ({
            title: `Card ${index + 1}`,
            content: `This is the content of card ${index + 1}`,
        }));

        return cards.map((card, index) => (
            <div key={index} className="w-64 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
                <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
                <p className="text-gray-600">{card.content}</p>
            </div>
        ));
    };

    return (
        <div className="App p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Card Layout</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {renderCards()}
            </div>
        </div>
    );
};

export default Defaultquiz;
