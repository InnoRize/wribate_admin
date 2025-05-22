import React from 'react';

export default function InformationSharingSection() {
  const sharingItems = [
    {
      title: "With your consent",
      description: "Like when you choose to share content on third-party platforms."
    },
    {
      title: "With linked services",
      description: "If you connect Wribate with another app, we'll only share what you allow."
    },
    {
      title: "With trusted partners",
      description: "Such as:",
      subItems: [
        "Payment processors (e.g., Stripe)",
        "Cloud storage providers",
        "Ad measurement services",
        "Identity and compliance verifiers for Wribate programs"
      ]
    },
    {
      title: "To follow the law",
      description: "If required by legal or governmental requests. We'll notify you when possible."
    },
    {
      title: "In emergencies",
      description: "If there's a risk of serious harm."
    },
    {
      title: "To enforce policies",
      description: "When necessary to protect Wribate.com and its users."
    },
    {
      title: "With affiliates",
      description: "Like parent (Innorize Enterprises Private Limited) or sibling companies under the Wribate.com/Innorize brand."
    },
    {
      title: "In aggregated or anonymous ways",
      description: "So you can't be personally identified (e.g., total post votes or ad views)."
    }
  ];

  return (
    <section className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white shadow-md">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How We Share Your Information
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            We only share your information when necessary, and always with care:
          </p>
        </div>
        
        <div className="space-y-6">
          {sharingItems.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-md text-gray-500">{item.description}</p>
                  
                  {item.subItems && (
                    <ul className="mt-3 pl-5 space-y-2">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex} className="flex items-start">
                          <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
                          <span className="ml-2 text-gray-600">{subItem}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}