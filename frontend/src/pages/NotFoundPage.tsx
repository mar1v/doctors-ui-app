import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center">
    <h1 className="text-6xl font-bold text-green-700 mb-4">404</h1>
    <p className="text-lg text-gray-700 mb-6">Сторінку не знайдено </p>
    <Link
      to="/"
      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
    >
      На головну
    </Link>
  </div>
);

export default NotFoundPage;
