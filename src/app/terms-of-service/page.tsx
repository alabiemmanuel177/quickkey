import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | QuickKey",
  description: "Terms of Service for QuickKey typing test application"
};

export default function TermsOfServicePage() {
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose dark:prose-invert">
        <p className="text-muted-foreground mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing or using QuickKey, you agree to be bound by these Terms of Service. 
          If you do not agree to these terms, please do not use our service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
        <p>
          QuickKey provides a typing test application that allows users to practice and 
          improve their typing speed and accuracy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Conduct</h2>
        <p>
          You agree not to use QuickKey for any unlawful purpose or in any way that 
          could damage, disable, overburden, or impair our service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
        <p>
          All content, features, and functionality of QuickKey are owned by us and 
          are protected by international copyright, trademark, and other intellectual property laws.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Disclaimer of Warranties</h2>
        <p>
          QuickKey is provided &quot;as is&quot; without warranties of any kind, either express or implied.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
        <p>
          In no event shall QuickKey be liable for any indirect, incidental, special, 
          consequential, or punitive damages.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Your continued use of 
          QuickKey after such changes constitutes your acceptance of the new terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us.
        </p>
      </div>
    </div>
  );
} 