import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Clock, Tag, Star, Image as ImageIcon } from 'lucide-react';
import { fetchPackages, type Package } from '../api/packages';

const PackageDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [pkg, setPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    const loadPackage = async () => {
      try {
        setLoading(true);
        // For now, we'll fetch all packages and find the one with matching slug
        // In a real app, you'd have a dedicated endpoint for single package
        const data = await fetchPackages({ page_size: 100 });
        const foundPackage = data.results.find(p => p.slug === slug);
        if (foundPackage) {
          setPackage(foundPackage);
          setSelectedImage(foundPackage.image1 || '');
        }
      } catch (error) {
        console.error('Failed to load package:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPackage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007CA6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h2>
          <p className="text-gray-600 mb-6">The package you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/plans')}
            className="bg-[#007CA6] hover:bg-[#00688d] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  const images = [pkg.image1, pkg.image2, pkg.image3, pkg.image4, pkg.image5].filter(Boolean) as string[];
  const features = pkg.includes ? pkg.includes.split('\n').filter(f => f.trim()) : [];
  const requirements = pkg.requirements ? pkg.requirements.split('\n').filter(f => f.trim()) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate('/plans')}
            className="flex items-center gap-2 text-[#007CA6] hover:text-[#00688d] font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Packages
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Packages</span>
            <span>/</span>
            <span>{pkg.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={selectedImage || pkg.image1}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === image ? 'border-[#007CA6]' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${pkg.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Package Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{pkg.name}</h1>
                {pkg.is_featured && (
                  <span className="flex items-center gap-1 bg-[#FDB043] text-white text-sm font-bold px-3 py-1 rounded-full">
                    <Star size={14} />
                    Featured
                  </span>
                )}
              </div>

              {pkg.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {pkg.tags.map(tag => (
                    <span key={tag.id} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                      <Tag size={12} />
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {pkg.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">₦{pkg.price}</span>
                {pkg.is_on_sale && pkg.undiscounted_price && (
                  <div className="text-right">
                    <span className="text-lg text-gray-500 line-through">₦{pkg.undiscounted_price}</span>
                    <div className="text-sm text-green-600 font-medium">
                      {pkg.discount_percentage}% off
                    </div>
                  </div>
                )}
              </div>

              {pkg.duration_days > 0 && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Clock size={16} />
                  <span>{pkg.duration_days} days duration</span>
                </div>
              )}

              <button className="w-full bg-[#007CA6] hover:bg-[#00688d] text-white font-semibold py-4 px-6 rounded-xl transition-colors">
                Book This Package
              </button>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1">
                        <Check size={16} className="text-green-500" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                <div className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#007CA6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-[#007CA6]" size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Duration</h4>
            <p className="text-gray-600">
              {pkg.duration_days > 0 ? `${pkg.duration_days} days` : 'Custom timeline'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-[#FDB043]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="text-[#FDB043]" size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
            <p className="text-gray-600">
              {pkg.tags.length > 0 ? pkg.tags.map(t => t.name).join(', ') : 'General'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
            <p className="text-gray-600">
              {pkg.is_active ? 'Available' : 'Unavailable'}
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[#007CA6] to-[#00688d] rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Book this package today and transform your space with our expert design services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#007CA6] hover:bg-gray-50 font-semibold py-3 px-8 rounded-xl transition-colors">
              Book This Package
            </button>
            <button
              onClick={() => navigate('/consultation')}
              className="bg-[#FDB043] hover:bg-[#e59b32] text-gray-900 font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;