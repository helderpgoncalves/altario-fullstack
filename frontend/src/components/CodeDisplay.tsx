import React from 'react';

interface CodeDisplayProps {
  code: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => (
  <div className="mt-4 text-xl font-semibold text-gray-700">
    Code: <span className="text-blue-600">{code}</span>
  </div>
);

export default CodeDisplay;

