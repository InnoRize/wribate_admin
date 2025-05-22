"use client"
import { useState } from 'react';

export default function InformationCollectedSection() {
  const [expandedSections, setExpandedSections] = useState({
    section1: false,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
    section6: false
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const SectionToggle = ({ id, title, isExpanded }) => (
    <button 
      onClick={() => toggleSection(id)}
      className="flex items-center justify-between w-full py-3 text-left font-medium text-gray-800 hover:text-indigo-600 focus:outline-none"
    >
      <span>{title}</span>
      <svg 
        className={`w-5 h-5 ml-2 transform ${isExpanded ? 'rotate-180' : ''} transition-transform duration-200`}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="px-6 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
           What Information We Collect
        </h2>
        
        {/* Section 1 */}
        <div className="border-b border-gray-200">
          <SectionToggle 
            id="section1" 
            title="1. Information You Provide to Us" 
            isExpanded={expandedSections.section1} 
          />
          
          {expandedSections.section1 && (
            <div className="pb-4">
              <p className="text-gray-700 mb-4">
                You can browse Wribate without an account, but creating one allows you to post and interact fully. When signing up, we may collect:
              </p>
              
              <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                <li>Username (public; does not have to be your real name)</li>
                <li>Email or phone number (for verification and login)</li>
                <li>Password, or SSO login (e.g., Google, Apple)</li>
                <li>Optional profile details like bio, profile picture, age, gender, location, or interests</li>
                <li>User preferences and settings</li>
              </ul>
              
              <p className="text-gray-700 mb-4">
                We may ask for preferences (e.g., favorite topics) to personalize your experience.
              </p>
              
              <div className="mt-6 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Non-Public Content</h3>
                <p className="text-gray-700 mb-2">
                  We also collect private content you submit on Wribate, such as:
                </p>
                <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                  <li>Saved drafts</li>
                  <li>Private messages or chats</li>
                  <li>User reports or messages to moderators or support</li>
                  <li>Uploaded media (text, links, images, audio, etc.)</li>
                </ul>
              </div>
              
              <div className="mt-6 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Actions You Take</h3>
                <p className="text-gray-700 mb-2">
                  We collect data on how you interact with Wribate, including:
                </p>
                <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                  <li>Votes, comments, arguments, follows, and blocks</li>
                  <li>Debate participation</li>
                  <li>Community joins or moderator actions</li>
                  <li>Post saves, hides, and reports</li>
                </ul>
                <p className="text-gray-700">
                  This helps us improve the platform experience and keep Wribate safe and engaging.
                </p>
              </div>
              
              <div className="mt-6 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Transactional & Other Information</h3>
                
                <div className="ml-2">
                  <h4 className="font-medium text-gray-800 mb-2">Transactional Information</h4>
                  <p className="text-gray-700 mb-2">
                    If you purchase subscriptions or services on Wribate, we collect:
                  </p>
                  <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                    <li>Purchase details (e.g., product, amount paid, purchase and renewal dates)</li>
                    <li>Payment method details (handled by third-party providers like Stripe or Razorpay)</li>
                  </ul>
                  <p className="text-gray-700 mb-4">
                    We do not store your full payment information. All transactions are processed through secure, industry-standard payment processors governed by their own terms and privacy policies.
                  </p>
                </div>
                
                <div className="ml-2">
                  <h4 className="font-medium text-gray-800 mb-2">Other Information</h4>
                  <p className="text-gray-700 mb-2">
                    You may choose to share additional information with us, such as when:
                  </p>
                  <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                    <li>Filling out feedback forms or surveys</li>
                    <li>Participating in promotions or referral programs</li>
                    <li>Applying to jobs or internships</li>
                    <li>Requesting customer support</li>
                    <li>Contacting us directly via email or chat</li>
                  </ul>
                  <p className="text-gray-700">
                    We only use this information to provide and improve Wribate.com's services and to respond to your inquiries or feedback.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Section 2 */}
        <div className="border-b border-gray-200">
          <SectionToggle 
            id="section2" 
            title="2. Information We Collect Automatically" 
            isExpanded={expandedSections.section2} 
          />
          
          {expandedSections.section2 && (
            <div className="pb-4">
              <p className="text-gray-700 mb-4">
                When you use Wribate, we may automatically collect certain technical data to operate, secure, and improve our Services.
              </p>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">a) Log and Usage Data</h3>
                <p className="text-gray-700 mb-2">We may collect:</p>
                <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                  <li>IP address, browser type, device ID, and operating system</li>
                  <li>Referral URLs, pages visited, links clicked, and time spent</li>
                  <li>Search terms and navigation activity</li>
                  <li>Mobile carrier and device settings (if applicable)</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  We use this data to understand how users interact with Wribate and to improve performance and security.
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">b) Cookies and Similar Technologies</h3>
                <p className="text-gray-700 mb-2">We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                  <li>Maintain and personalize your experience (e.g., language settings)</li>
                  <li>Analyze usage and engagement</li>
                  <li>Show relevant content or promotions</li>
                  <li>Improve site performance</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  You can manage or disable cookies through your browser settings.
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">c) Location Information</h3>
                <p className="text-gray-700">
                  We may process your approximate location using your IP address or if you share location info directly through settings or content tags. This helps us customize your experience, such as by showing relevant topics or user connections.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Section 3 */}
        <div className="border-b border-gray-200">
          <SectionToggle 
            id="section3" 
            title="3. Information from Other Sources" 
            isExpanded={expandedSections.section3} 
          />
          
          {expandedSections.section3 && (
            <div className="pb-4">
              <p className="text-gray-700 mb-4">
                We may collect and combine information about you from third-party sources to improve your Wribate experience.
              </p>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Third-Party Data</h3>
                <p className="text-gray-700 mb-2">We may receive:</p>
                <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                  <li>Demographic or interest data from partners, advertisers, or analytics providers</li>
                  <li>Data linked by hashed identifiers (like email or device ID) for personalization or ad relevance</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  You can manage personalization settings through your account preferences.
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">a) Linked Services</h3>
                <p className="text-gray-700 mb-2">
                  If you sign in or connect a third-party service (like Google), we may receive:
                </p>
                <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                  <li>Basic account info (e.g., name, email)</li>
                  <li>Usage data from authorized apps using Wribate APIs</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  Only necessary info is shared and you remain in control of linked accounts.
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">b) Integrated Platforms</h3>
                <p className="text-gray-700 mb-2">
                  If you interact with Wribate embeds or our ads on other platforms, we may receive:
                </p>
                <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                  <li>Limited activity data (e.g., page visited or actions taken)</li>
                  <li>Cookie or usage information to improve content relevance and functionality</li>
                </ul>
                <p className="text-gray-700">
                  You can manage how this information is used under Your Privacy Choices.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Section 4 */}
        <div className="border-b border-gray-200">
          <SectionToggle 
            id="section4" 
            title="4. Information Collected by Third Parties" 
            isExpanded={expandedSections.section4} 
          />
          
          {expandedSections.section4 && (
            <div className="pb-4">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">a) Embedded Content</h3>
                <p className="text-gray-700 mb-4">
                  Wribate may display third-party content (like YouTube videos or social media posts) directly on the platform via embeds. These third-party services may collect data about your interaction with their content (e.g., views, clicks).
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                  <p className="text-amber-800">
                    <span className="font-bold">⚠️ Note:</span> Data collected via embeds is governed by the privacy policies of the third-party platforms, not Wribate.com.
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">b) Audience Measurement</h3>
                <p className="text-gray-700">
                  We partner with analytics providers to help us understand the demographics and interests of Wribate users. These partners may use cookies and device identifiers to estimate audience data and measure reach.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Section 5 */}
        <div className="border-b border-gray-200">
          <SectionToggle 
            id="section5" 
            title="5. Information from Advertisers and Partners" 
            isExpanded={expandedSections.section5} 
          />
          
          {expandedSections.section5 && (
            <div className="pb-4">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">a) Advertisers and Promotional Partners</h3>
                <p className="text-gray-700 mb-2">
                  If you use Wribate Ads (our self-serve ad platform), we collect information such as:
                </p>
                <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                  <li>Your name and contact details</li>
                  <li>Business or organization information</li>
                  <li>Payment and billing details</li>
                  <li>Documents for identity verification (if required)</li>
                </ul>
                <p className="text-gray-700 mb-1">
                  We may also conduct session replays for usability, support, and troubleshooting purposes.
                </p>
                <p className="text-gray-700 mb-4">
                  Some company information may be made public if legally required.
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">b) Wribate Premium Users</h3>
                <p className="text-gray-700 mb-2">
                  If you sign up for Wribate Premium/Pro (advanced tools for creators, institutions, or moderators), we may collect:
                </p>
                <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                  <li>Profile type and industry</li>
                  <li>Name, organization size, and website (if applicable)</li>
                  <li>Additional verification documents if needed</li>
                </ul>
                <p className="text-gray-700">
                  This helps us tailor services and ensure secure access to enhanced features.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Section 6 */}
        <div className="border-b border-gray-200">
          <SectionToggle 
            id="section6" 
            title="6. Information from Wribate Program Participants" 
            isExpanded={expandedSections.section6} 
          />
          
          {expandedSections.section6 && (
            <div className="pb-4">
              <p className="text-gray-700 mb-4">
                If you choose to participate in a Wribate Program (such as contributor rewards or campus ambassador initiatives), we may collect the following information directly or via our trusted providers:
              </p>
              
              <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                <li>Full name, date of birth, and address</li>
                <li>Email, tax and government ID details</li>
                <li>Payment and bank-related information</li>
              </ul>
              
              <p className="text-gray-700 mb-2">
                This information helps us:
              </p>
              <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-1">
                <li>Verify your eligibility</li>
                <li>Process payments</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
              
              <p className="text-gray-700 italic">
                Please note that third-party compliance and payment providers involved operate under their own terms and privacy policies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}