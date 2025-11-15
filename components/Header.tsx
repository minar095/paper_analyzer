
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-300">
        Academic Paper Analyzer
      </h1>
      <p className="mt-4 text-lg text-neutral-medium max-w-3xl mx-auto">
        Leverage the power of Gemini to perform a deep, comparative analysis of research papers and uncover insights for future work.
      </p>
    </header>
  );
};

export default Header;
