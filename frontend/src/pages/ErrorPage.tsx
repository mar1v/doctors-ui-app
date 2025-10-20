import React from "react";
import { Link } from "react-router-dom";

const ErrorPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center">
    <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
    <p className="text-lg text-gray-700 mb-6">
      Виникла внутрішня помилка сервера
    </p>
    <Link
      to="/"
      className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
    >
      Спробувати знову
    </Link>
  </div>
);

export default ErrorPage;
