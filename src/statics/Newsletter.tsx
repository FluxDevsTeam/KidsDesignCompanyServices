import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { subscribeToNewsletter } from '../api/newsletter';

const NewsletterHero = () => (
  <div className="bg-gradient-to-br from-[#007CA6] to-[#005f7a] text-white py-16 md:py-24">
    <div className="max-w-4xl mx-auto text-center px-6">
      <div className="mb-6">
        <Mail size={64} className="mx-auto text-white/80" />
      </div>
      <h1 className="text-3xl md:text-5xl font-bold mb-6">
        Stay Connected with Kids Design Company
      </h1>
      <p className="text-lg md:text-xl text-white/90 leading-relaxed">
        Get the latest design trends, project showcases, and exclusive insights delivered straight to your inbox.
        Join our community of design enthusiasts and never miss an update!
      </p>
    </div>
  </div>
);

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubmitting(true);
      setMessage(null);
      await subscribeToNewsletter({ email });
      setMessage({ type: 'success', text: 'Successfully subscribed to our newsletter!' });
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      setMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Join thousands of subscribers who receive our weekly design inspiration and project updates.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007CA6] focus:border-transparent transition-colors"
              required
            />
          </div>

          {message && (
            <div className={`flex items-center gap-3 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !email}
            className="w-full bg-[#007CA6] hover:bg-[#00688d] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Subscribing...
              </>
            ) : (
              <>
                <Mail size={18} />
                Subscribe Now
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

const Benefits = () => {
  const benefits = [
    {
      title: "Design Inspiration",
      description: "Weekly curated content featuring the latest trends in children's design and space planning."
    },
    {
      title: "Project Showcases",
      description: "Behind-the-scenes looks at our completed projects and client success stories."
    },
    {
      title: "Expert Tips",
      description: "Practical advice from our design experts on creating functional and beautiful spaces for kids."
    },
    {
      title: "Exclusive Offers",
      description: "Be the first to know about special promotions and early access to new services."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What You'll Get
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-[#007CA6] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="bg-[#FDB043] py-16">
    <div className="max-w-4xl mx-auto text-center px-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Ready to Transform Your Space?
      </h2>
      <p className="text-gray-800 mb-8 text-lg">
        Subscribe now and get our free guide: "10 Essential Tips for Designing Kid-Friendly Spaces"
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-[#007CA6] hover:bg-[#00688d] text-white px-8 py-3 rounded-md font-semibold transition-colors">
          Book Consultation
        </button>
        <button className="bg-white hover:bg-gray-50 text-[#007CA6] px-8 py-3 rounded-md font-semibold transition-colors border border-[#007CA6]">
          View Our Work
        </button>
      </div>
    </div>
  </section>
);

export default function Newsletter() {
  return (
    <div className="font-sans min-h-screen bg-white">
      <NewsletterHero />
      <NewsletterForm />
      <Benefits />
      <CTASection />
    </div>
  );
}