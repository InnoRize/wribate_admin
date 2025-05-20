import { useState, useEffect } from 'react';

const NavigationBar = ({ setCurrentSection, currentSection }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile screens
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  return (
    <div className="flex border-b border-gray-300 bg-white sticky top-0 z-10">
      <button
        onClick={() => setCurrentSection(1)}
        className={`flex-1 ${isMobile ? 'py-2 text-xs' : 'py-4 text-base'} font-bold border-b-4 ${
          currentSection === 1 
            ? 'border-blue-900 text-blue-900' 
            : 'border-transparent text-gray-500'
        }`}
      >
        {isMobile ? '1. TOPIC' : '1. TOPIC'}
      </button>
      <button
        onClick={() => setCurrentSection(2)}
        className={`flex-1 ${isMobile ? 'py-2 text-xs' : 'py-4 text-base'} font-bold border-b-4 ${
          currentSection === 2 
            ? 'border-blue-900 text-blue-900' 
            : 'border-transparent text-gray-500'
        }`}
      >
        {isMobile ? '2. PARTICIPANTS' : '2. PARTICIPANTS'}
      </button>
      <button
        onClick={() => setCurrentSection(3)}
        className={`flex-1 ${isMobile ? 'py-2 text-xs' : 'py-4 text-base'} font-bold border-b-4 ${
          currentSection === 3 
            ? 'border-blue-900 text-blue-900' 
            : 'border-transparent text-gray-500'
        }`}
      >
        {isMobile ? '3. SCOPE' : '3. SCOPE'}
      </button>
    </div>
  );
}

export default NavigationBar;