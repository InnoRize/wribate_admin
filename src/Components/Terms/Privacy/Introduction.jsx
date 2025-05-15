"use client"
import { useState } from 'react';

export default function PrivacyPolicyIntroduction() {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto bg-white ">
      {/* Introduction content */}
      <div id="privacy" className="px-6 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          Wribate is one of the most democratic platforms available, built on the core principles of equal opportunity, 
          mutual respect, freedom of speech and expression, and a commitment to grace and open dialogue. At Wribate.com, 
          we also believe that privacy is a fundamental right. We strive to empower our users to control their online 
          presence and data. This privacy policy outlines how and why Wribate.com ("Innorize Enterprises Private Limited", "Wribate", 
          "we," or "us") collects, uses, and shares information about you when you use our website, mobile applications, 
          widgets, APIs, emails, and other online products and services (collectively, the "Services").
        </p>
        
        {/* TL;DR Section */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="inline-block mr-2 text-indigo-600">TL;DR</span>
            <span className="h-px flex-grow bg-gray-300"></span>
          </h3>
          
          <ul className="space-y-4">
            <li className="flex">
              <div className="mr-4 mt-1">
                <div className="h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">1</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Wribate is a public platform.</h4>
                <p className="text-gray-600">Our platform is designed to be accessible to everyone. While you can browse anonymously, certain aspects of your activity may be visible to others.</p>
              </div>
            </li>
            
            <li className="flex">
              <div className="mr-4 mt-1">
                <div className="h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">2</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">We collect minimal information about you.</h4>
                <p className="text-gray-600">We collect minimal information that can be used to identify you. You can choose to remain anonymous by not creating an account. If you choose to create an account, you are not required to provide your real name. We do not track your precise location.</p>
              </div>
            </li>
            
            <li className="flex">
              <div className="mr-4 mt-1">
                <div className="h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">3</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">We use data to enhance your experience.</h4>
                <p className="text-gray-600">The data we collect is primarily used to provide and improve our Services, which are focused on connecting people and fostering communities. We do not sell your personal data to third parties, and we do not work with data brokers.</p>
              </div>
            </li>
            
            <li className="flex">
              <div className="mr-4 mt-1">
                <div className="h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">4</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">You have control over your data.</h4>
                <p className="text-gray-600">All users have the right to access, modify, or delete their data. You can also request more information about our data practices and policies.</p>
              </div>
            </li>
            
            <li className="flex">
              <div className="mr-4 mt-1">
                <div className="h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">5</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">We are committed to transparency.</h4>
                <p className="text-gray-600">If you have any questions about how we use data, please don't hesitate to contact us. We are committed to providing clear and accessible information about our privacy practices.</p>
              </div>
            </li>
          </ul>
        </div>
        
      
      </div>
    </div>
  );
}