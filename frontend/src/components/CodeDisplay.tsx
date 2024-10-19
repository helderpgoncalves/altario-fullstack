import React from 'react';

interface CodeDisplayProps {
  code: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => (
  <div className="mt-6 p-4 bg-gradient-to-br from-gray-900 to-blue-900 rounded-lg shadow-xl overflow-x-auto">
    <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text animate-pulse">
      Generated Code
    </h2>
    <div className="relative">
      <pre className="text-base bg-black bg-opacity-50 p-3 rounded-md">
        <code className="font-mono">
          <span className="text-green-400 opacity-75">{`// Code:`}</span>
          <span className="text-yellow-300 block mt-1 animate-fade-in">{code}</span>
        </code>
      </pre>
      <div className="absolute top-2 right-2 flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
      </div>
    </div>
  </div>
);

export default CodeDisplay;
