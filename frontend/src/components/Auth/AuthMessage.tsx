import React from "react";

interface Props {
  message: string;
}

const AuthMessage: React.FC<Props> = ({ message }) =>
  message ? (
    <p className="mt-3 text-center text-red-500 font-medium">{message}</p>
  ) : null;

export default AuthMessage;
