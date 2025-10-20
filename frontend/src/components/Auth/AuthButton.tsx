import React from "react";

interface Props {
  text: string;
}

const AuthButton: React.FC<Props> = ({ text }) => (
  <button
    type="submit"
    className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
  >
    {text}
  </button>
);

export default AuthButton;
