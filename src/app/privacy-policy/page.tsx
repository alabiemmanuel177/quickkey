import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | QuickKey",
  description: "Privacy Policy for QuickKey typing test application"
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert">
        <p className="text-muted-foreground mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p>
          QuickKey collects the following information to provide and improve our service:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Usage statistics (typing speed, accuracy, test duration)</li>
          <li>Account information (if you choose to create an account)</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Provide, maintain, and improve our service</li>
          <li>Track your progress and generate statistics</li>
          <li>Personalize your experience</li>
          <li>Communicate with you about updates</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personally identifiable 
          information to third parties. This does not include trusted third parties 
          who assist us in operating our service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your 
          personal information. However, no method of transmission over the Internet 
          is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Choices</h2>
        <p>
          You may opt out of any future contacts from us or request that we delete 
          your data by contacting us.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of 
          any changes by posting the new Privacy Policy on this page.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Information</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us.
        </p>
      </div>
    </div>
  );
} 