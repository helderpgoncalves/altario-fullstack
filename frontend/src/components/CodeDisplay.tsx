import React from "react";

interface CodeDisplayProps {
  code: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => (
  <div className="mt-6">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
    Code: <span className="text-blue-500 font-bold">{code}</span>
    </h2>
  </div>
);

export default CodeDisplay;
