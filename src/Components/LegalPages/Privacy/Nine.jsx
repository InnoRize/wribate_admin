"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp, Globe, Shield, FileText } from 'lucide-react';

export default function PrivacyPolicyRegional() {
  const [expandedSection, setExpandedSection] = useState("international"); 
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
      
      {/* International Data Transfers Section */}
      <div className="mb-6 border-b pb-2">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => toggleSection("international")}
        >
          <div className="flex items-center">
            <Globe className="mr-2 text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-700">International Data Transfers</h2>
          </div>
          {expandedSection === "international" ? 
            <ChevronUp className="text-gray-500" /> : 
            <ChevronDown className="text-gray-500" />
          }
        </div>
        
        {expandedSection === "international" && (
          <div className="mt-4 text-gray-600 space-y-4 pl-8">
            <p>
              Wribate is based in India, and your data is processed and stored on servers there, and potentially in other countries. 
              By using Wribate, you consent to the processing and storage of your data in the U.S. and other locations.
            </p>
            <p>
              <strong>Transfers from the EEA, UK, or Switzerland:</strong> For data transfers from these regions, 
              Wribate uses Standard Contractual Clauses approved by the European Commission or other adequate 
              mechanisms as required by law.
            </p>
          </div>
        )}
      </div>
      
      {/* EEA and UK Users Section */}
      <div className="mb-6 border-b pb-2">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => toggleSection("eea")}
        >
          <div className="flex items-center">
            <Shield className="mr-2 text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-700">Additional Information for EEA and UK Users</h2>
          </div>
          {expandedSection === "eea" ? 
            <ChevronUp className="text-gray-500" /> : 
            <ChevronDown className="text-gray-500" />
          }
        </div>
        
        {expandedSection === "eea" && (
          <div className="mt-4 text-gray-600 space-y-4 pl-8">
            <p>
              If you reside in the European Economic Area (EEA), Wribate.com/IEPL, India is the controller of your 
              information in connection with our platform and this policy. If you're based in the United Kingdom (UK), 
              Wribate.com/IEPL, India is the data controller, and we may have a representative for GDPR purposes.
            </p>
            <p><strong>As an EEA or UK user, you have the following rights regarding your personal data:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access to your personal data</li>
              <li>Rectification or correction of inaccurate data</li>
              <li>Erasure (right to be forgotten)</li>
              <li>Data portability in certain situations</li>
              <li>Restriction of processing</li>
              <li>Objection to processing</li>
              <li>Withdrawal of consent if you previously provided it</li>
            </ul>
            <p>
              These rights can be exercised as detailed in the "Your Rights and Choices" section above. 
              EEA users can also lodge a complaint with your local supervisory authority.
            </p>
            <p><strong>Wribate processes your data only when there is a legal basis to do so. We rely on the following bases:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Contractual necessity: To provide, operate, and improve our services, and for customer support</li>
              <li>Legitimate interests: Such as preventing fraud, ensuring security, research, development, and marketing</li>
              <li>Your consent for specific purposes</li>
              <li>Legal obligations compliance</li>
            </ul>
          </div>
        )}
      </div>
      
      {/* California Users Section */}
      <div className="mb-6 border-b pb-2">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => toggleSection("california")}
        >
          <div className="flex items-center">
            <FileText className="mr-2 text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-700">Additional Information for California Users</h2>
          </div>
          {expandedSection === "california" ? 
            <ChevronUp className="text-gray-500" /> : 
            <ChevronDown className="text-gray-500" />
          }
        </div>
        
        {expandedSection === "california" && (
          <div className="mt-4 text-gray-600 space-y-4 pl-8">
            <p>
              Under the California Consumer Privacy Act (CCPA), Wribate provides the following additional 
              information for California residents:
            </p>
            <p>
              In the past 12 months, we may have collected the following categories of personal information from 
              California residents, depending on the services used:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Identifiers: such as username, email, phone number, and IP address</li>
              <li>Commercial information: related to transactions with Wribate</li>
              <li>Internet and network activity: information about your usage of our services</li>
              <li>Geolocation data: based on your IP address</li>
              <li>Communications: messages and interactions with other users</li>
              <li>Audiovisual information: such as images, audio, or video you submit</li>
              <li>Employment and demographic information: if provided (e.g., through job applications)</li>
              <li>Inferences: derived from other data for purposes like content recommendations</li>
            </ul>
            <p>For more details, please refer to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Information we collect: in the "Information We Collect" section</li>
              <li>How we use your information: in the "How We Use Your Information" section</li>
              <li>How we share your information: in the "How We Share Information" section</li>
            </ul>
            <p><strong>California residents have additional rights under the CCPA, such as:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Opting out of any "sale" or "sharing" of your personal information</li>
              <li>Requesting access, deletion, or correction of your personal data</li>
              <li>Protection from discrimination for exercising your privacy rights</li>
            </ul>
            <p>
              Wribate does not "sell" or "share" personal information as defined by the CCPA. We only use and 
              disclose sensitive data as required to provide services or as allowed by the CCPA.
            </p>
            <p>
              To exercise your CCPA rights, please refer to the "Your Rights and Choices" section. Requests will be 
              verified via your account login or additional information when necessary. If an authorized agent submits 
              a request on your behalf, a valid power of attorney or other proof of authorization may be required.
            </p>
            <p>
              For questions or concerns, please contact us at <a href="mailto:dataprivacy@wribate.com" className="text-blue-600 hover:underline">dataprivacy@wribate.com</a>.
            </p>
          </div>
        )}
      </div>
      
      {/* Children Section */}
      <div className="mb-6 border-b pb-2">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => toggleSection("children")}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 text-blue-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 4h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5"></path>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
              <path d="M17 3v2"></path>
              <path d="M12 3v2"></path>
              <path d="M7 3v2"></path>
              <path d="m6 12 6 6 6-6"></path>
            </svg>
            <h2 className="text-xl font-semibold text-gray-700">Children</h2>
          </div>
          {expandedSection === "children" ? 
            <ChevronUp className="text-gray-500" /> : 
            <ChevronDown className="text-gray-500" />
          }
        </div>
        
        {expandedSection === "children" && (
          <div className="mt-4 text-gray-600 space-y-4 pl-8">
            <p>
              Children under the age of 13 are not permitted to create an account or use the Wribate platform. 
              If you are located outside the United States, you must meet the minimum age required by the laws 
              of your country to use our Services, or we must have received verifiable consent from your parent 
              or legal guardian.
            </p>
          </div>
        )}
      </div>
      
      {/* Changes to Policy Section */}
      <div className="mb-6 border-b pb-2">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => toggleSection("changes")}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 text-blue-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              <path d="m15 5 4 4"></path>
            </svg>
            <h2 className="text-xl font-semibold text-gray-700">Changes to This Policy</h2>
          </div>
          {expandedSection === "changes" ? 
            <ChevronUp className="text-gray-500" /> : 
            <ChevronDown className="text-gray-500" />
          }
        </div>
        
        {expandedSection === "changes" && (
          <div className="mt-4 text-gray-600 space-y-4 pl-8">
            <p>
              We may update this Privacy Policy from time to time. If we make changes, we will update the 
              "Last Updated" date at the top of the policy. For material changes, we may also notify you 
              via email (if provided) or through a notice on the Wribate platform. We encourage you to 
              check this page periodically to stay informed about how we handle your information. By continuing 
              to use our Services after updates become effective, you agree to the revised Privacy Policy.
            </p>
          </div>
        )}
      </div>
      
      {/* Contact Us Section */}
      <div className="mb-2">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => toggleSection("contact")}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 text-blue-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <h2 className="text-xl font-semibold text-gray-700">Contact Us</h2>
          </div>
          {expandedSection === "contact" ? 
            <ChevronUp className="text-gray-500" /> : 
            <ChevronDown className="text-gray-500" />
          }
        </div>
        
        {expandedSection === "contact" && (
          <div className="mt-4 text-gray-600 space-y-4 pl-8">
            <p>
              If you have any questions or concerns about this Privacy Policy or our privacy practices, 
              you may contact us at:
            </p>
            <p className="flex items-center">
              <span className="mr-2">📧</span> Email: 
              <a href="mailto:dataprivacy@wribate.com" className="ml-1 text-blue-600 hover:underline">dataprivacy@wribate.com</a> / 
              <a href="mailto:support@wribate.com" className="ml-1 text-blue-600 hover:underline">support@wribate.com</a> / 
              <a href="mailto:info@wribate.com" className="ml-1 text-blue-600 hover:underline">info@wribate.com</a>
            </p>
            <p className="flex items-center">
              <span className="mr-2">🌐</span> Website: 
              <a href="https://www.wribate.com" className="ml-1 text-blue-600 hover:underline">www.wribate.com</a>
            </p>
            <div className="pl-6">
              <p className="font-medium">Address:</p>
              <p>C/o INNORIZE ENTERPRISES PRIVATE LIMITED</p>
              <p>D.No.17-1-389/18-B, 4th Floor,</p>
              <p>Prashanth Nagar Colony, Saidabad,</p>
              <p>Hyderabad, Telangana, India-500059.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
