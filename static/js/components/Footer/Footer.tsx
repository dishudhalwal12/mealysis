import React from 'react';
import { IconShare2 } from '@tabler/icons-react';

const handleShareWeb = async () => {
  const shareData = {
    title: 'MEALYSIS App',
    text: 'Compare prices across quick commerce apps in real-time. Save money on groceries and daily essentials.',
    url: 'https://mealysis.vercel.app',
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};

const handleShareApp = async () => {
  if (/Android/i.test(navigator.userAgent)) {
    window.location.href = `whatsapp://send?text=${encodeURIComponent(
      'Checkout Quick Compare App: Compare prices across quick commerce apps in real-time. Save money on groceries and daily essentials. https://mealysis.vercel.app'
    )}`;
    return;
  }
  const shareData = {
    title: 'Mealysis App',
    text: 'Compare prices across quick commerce apps in real-time. Save money on groceries and daily essentials.',
    url: 'https://mealysis.vercel.app',
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};

export const Footer = () => {
  return (
    <footer className="bottom-0 left-0 right-0 shadow-top z-50 pb-safe mt-auto bg-white dark:bg-transparent">
  <div className="container mx-auto px-4">
    <p className="text-center py-4 text-l text-gray-900 dark:text-white">Compare Fast • Save More</p>
    <div className="flex flex-col items-center">
      <div className="mb-6 flex space-x-4">
        <a 
          href="https://apple.co/40RjcWh" 
          className="inline-block"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img 
            src="" 
            alt="" 
            className="h-10" 
          />
        </a>
        <a 
          href="https://play.google.com/store/apps/details?id=com.quickcompare.app&hl=en" 
          className="inline-block"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img 
            src="" 
            alt="" 
            className="h-10" 
          />
        </a>
      </div>
      <div className="mb-6 flex space-x-4">
        <img 
          src="https://i.pinimg.com/736x/4c/d3/8e/4cd38e5d59ced5285a4889c8fd54fce9.jpg" 
          alt="Quick Compare App" 
          className="h-10" 
        />
      </div>
      <div className="text-gray-500 dark:text-gray-400 text-sm items-center text-center">
        &copy; 2025 MEALYSIS Technologies Private Limited. All rights reserved.
      </div>

    </div>
  </div>
</footer>

  );
};



export const LogoFooter = () => {

  return (
    <footer className="bottom-0 left-0 right-0 shadow-top z-50 pb-safe mt-auto bg-white dark:bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="flex space-x-4 pt-16">
            <img 
              src="https://i.pinimg.com/736x/4c/d3/8e/4cd38e5d59ced5285a4889c8fd54fce9.jpg" 
              alt="Quick Compare App" 
              className="h-10" 
            />
          </div>
          <p className="text-center text-l text-text-light-dark">Compare Fast • Save More</p>
          <button
            onClick={handleShareApp}
            className="mt-4 flex items-center gap-2 px-4 py-2 text-xl font-semibold rounded-full bg-primary text-action dark:text-white hover:bg-primary-dark transition-colors"
          >
            <IconShare2 size={18} />
            <span>Share App</span>
          </button>
        </div>
      </div>
    </footer>
  );
};