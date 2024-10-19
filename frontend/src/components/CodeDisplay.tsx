import React from 'react';

interface CodeDisplayProps {
  code: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => (
  <div className="mt-6 p-4 bg-gradient-to-br from-gray-900 to-blue-900 rounded-lg shadow-xl overflow-x-auto">
    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text animate-pulse">
      Generated Code: <span className="text-yellow-300">{code}</span>
    </h2>
  </div>
);

export default CodeDisplay;
