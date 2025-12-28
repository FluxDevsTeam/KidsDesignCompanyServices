import { Check, MessageCircle, Filter, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPackages, fetchPackageTags, type Package, type PackageTag } from '../api/packages';

interface CheckItemProps {
  text: string;
}

interface PricingCardProps {
  package: Package;
  isPopular: boolean;
  onViewDetails: (pkg: Package) => void;
}

// --- Sub-Components ---

const PricingHeader = () => (
  <div className="text-center py-16 px-4 max-w-4xl mx-auto">
    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Our Pricing Plan</h1>
    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
      Our Plans Give You A Starting Point — From One-Time Design Consultations To Full Creative Transformations.
      Custom Quotes Are Available For Larger Projects And Institutions.
    </p>
  </div>
);

const CheckItem = ({ text }: CheckItemProps) => (
  <li className="flex items-start gap-3 mb-3">
    <div className="mt-0.5 min-w-[20px] min-h-[20px] rounded-full border border-[#087CA7] flex items-center justify-center text-[#087CA7]">
      <Check size={12} strokeWidth={3} />
    </div>
    <span className="text-sm text-gray-700 leading-tight">{text}</span>
  </li>
);

const PricingCard = ({ package: pkg, isPopular, onViewDetails }: PricingCardProps) => {
  const features = pkg.includes ? pkg.includes.split('\n').filter(f => f.trim()) : [];
  const isPremium = pkg.is_featured;
  const buttonColor = isPremium ? 'orange' : 'blue';

  return (
    <div className={`rounded-2xl p-8 flex flex-col h-full relative ${isPremium ? 'bg-[#FFFBF3] border border-[#FDB043]/30 shadow-sm' : 'bg-white border border-gray-200'}`}>

      {isPopular && (
        <span className="absolute top-8 right-8 bg-[#FDB043] text-white text-xs font-bold px-3 py-1 rounded-full">
          Popular
        </span>
      )}

      <h3 className="text-2xl font-bold text-gray-900 mb-4">{pkg.name}</h3>
      <p className="text-gray-600 text-sm mb-8 min-h-[40px]">{pkg.short_description || pkg.description}</p>

      <div className="mb-6">
        <h4 className="font-bold text-sm text-gray-900 mb-4">Features</h4>
        <ul className="space-y-1">
          {features.map((feature, idx) => (
            <CheckItem key={idx} text={feature} />
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-6">
        <div className="text-2xl font-bold text-gray-900 mb-4">
          ₦{pkg.price}
          {pkg.undiscounted_price && (
            <span className="text-sm text-gray-500 line-through ml-2">₦{pkg.undiscounted_price}</span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onViewDetails(pkg)}
            className={`flex-1 py-3.5 rounded-full font-semibold text-white transition-transform hover:scale-[1.02] ${
              buttonColor === 'orange' ? 'bg-[#FDB043] hover:bg-[#e59b32]' : 'bg-[#087CA7] hover:bg-[#066a8f]'
            }`}
          >
            View Details
          </button>
          <button
            className={`px-4 py-3.5 rounded-full font-semibold border-2 transition-transform hover:scale-[1.02] ${
              buttonColor === 'orange'
                ? 'border-[#FDB043] text-[#FDB043] hover:bg-[#FDB043] hover:text-white'
                : 'border-[#087CA7] text-[#087CA7] hover:bg-[#087CA7] hover:text-white'
            }`}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

const PlansOverview = ({ packages }: { packages: Package[] }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-10">All Available Packages</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-4 font-bold text-gray-900 w-1/5">Package</th>
              <th className="py-4 font-bold text-gray-900 w-1/4">Description</th>
              <th className="py-4 font-bold text-gray-900 w-1/3">Features</th>
              <th className="py-4 font-bold text-gray-900 w-1/5">Price</th>
              <th className="py-4 font-bold text-gray-900 w-1/6">Duration</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg, idx) => (
              <tr key={pkg.id} className={idx !== packages.length - 1 ? "border-b border-gray-100" : ""}>
                <td className="py-6 pr-4 align-top">
                  <div className="flex items-center gap-3">
                    {pkg.image1 && (
                      <img
                        src={pkg.image1}
                        alt={pkg.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <div className="text-gray-800 font-medium">{pkg.name}</div>
                      {pkg.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {pkg.tags.slice(0, 2).map(tag => (
                            <span key={tag.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-6 pr-4 align-top text-gray-600 leading-relaxed">
                  {pkg.short_description || pkg.description.substring(0, 100) + '...'}
                </td>
                <td className="py-6 pr-4 align-top text-gray-600 leading-relaxed">
                  {pkg.includes ? (
                    <ul className="list-disc list-inside space-y-1">
                      {pkg.includes.split('\n').filter(f => f.trim()).slice(0, 3).map((feature, i) => (
                        <li key={i} className="text-sm">{feature}</li>
                      ))}
                      {pkg.includes.split('\n').filter(f => f.trim()).length > 3 && (
                        <li className="text-sm text-gray-400">+ more features</li>
                      )}
                    </ul>
                  ) : (
                    <span className="text-gray-400">No features listed</span>
                  )}
                </td>
                <td className="py-6 align-top">
                  <div className="text-gray-900 font-medium">
                    ₦{pkg.price}
                    {pkg.is_on_sale && pkg.undiscounted_price && (
                      <div className="text-sm text-gray-500 line-through">
                        ₦{pkg.undiscounted_price}
                      </div>
                    )}
                    {pkg.discount_percentage > 0 && (
                      <div className="text-xs text-green-600 font-medium">
                        {pkg.discount_percentage}% off
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-6 align-top text-gray-900 font-medium">
                  {pkg.duration_days > 0 ? `${pkg.duration_days} days` : 'Custom'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked View */}
      <div className="md:hidden space-y-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              {pkg.image1 && (
                <img
                  src={pkg.image1}
                  alt={pkg.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                  {pkg.is_featured && (
                    <span className="bg-[#FDB043] text-white text-xs font-bold px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                {pkg.tags.length > 0 && (
                  <div className="flex gap-1 mb-2">
                    {pkg.tags.slice(0, 3).map(tag => (
                      <span key={tag.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-gray-600 text-sm mb-3">
                  {pkg.short_description || pkg.description.substring(0, 120) + '...'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase">Price</span>
                <div className="text-gray-900 font-bold mt-1">
                  ₦{pkg.price}
                  {pkg.is_on_sale && pkg.undiscounted_price && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₦{pkg.undiscounted_price}
                    </span>
                  )}
                </div>
                {pkg.discount_percentage > 0 && (
                  <div className="text-xs text-green-600 font-medium">
                    {pkg.discount_percentage}% off
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase">Duration</span>
                <p className="text-gray-900 font-medium mt-1">
                  {pkg.duration_days > 0 ? `${pkg.duration_days} days` : 'Custom'}
                </p>
              </div>
            </div>

            {pkg.includes && (
              <div className="mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase">Features</span>
                <ul className="mt-2 space-y-1">
                  {pkg.includes.split('\n').filter(f => f.trim()).slice(0, 3).map((feature, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button className="w-full bg-[#087CA7] hover:bg-[#066a8f] text-white py-3 rounded-lg font-semibold transition-colors">
              Book This Package
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

const StillDeciding = () => (
  <div className="bg-[#F9FAFB] py-16 px-6 text-center mb-12">
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      <div className="mb-4 text-gray-400">
        <MessageCircle size={48} strokeWidth={1.5} />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Still Deciding?</h2>
      <p className="text-gray-600 mb-8">Every Project Starts With A Chat. Send Us A Message.</p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button className="bg-[#087CA7] hover:bg-[#066a8f] text-white px-8 py-3 rounded-md font-semibold transition-colors w-full sm:w-auto">
          Contact Us
        </button>
        <button className="bg-[#FDB043] hover:bg-[#e59b32] text-gray-900 px-8 py-3 rounded-md font-semibold transition-colors w-full sm:w-auto">
          Book Consultation
        </button>
      </div>
    </div>
  </div>
);

// --- Main Component ---

export default function Plans() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [tags, setTags] = useState<PackageTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'created_at'>('name');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [packagesData, tagsData] = await Promise.all([
          fetchPackages({ page_size: 50 }),
          fetchPackageTags()
        ]);
        setAllPackages(packagesData.results);
        setPackages(packagesData.results);
        setTags(tagsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter and sort packages
  useEffect(() => {
    let filtered = [...allPackages];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(pkg =>
        selectedTags.some(tagId => pkg.tags.some(tag => tag.id === tagId))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setPackages(filtered);
  }, [allPackages, searchTerm, selectedTags, sortBy]);

  const handleViewDetails = (pkg: Package) => {
    navigate(`/package/${pkg.slug}`);
  };

  if (loading) {
    return (
      <div className="font-sans min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007CA6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-white">
      <PricingHeader />

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007CA6] focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'created_at')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007CA6] focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="created_at">Newest</option>
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-[#007CA6] text-white border-[#007CA6]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} />
              Filters
              {selectedTags.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {selectedTags.length}
                </span>
              )}
            </button>
          </div>

          {/* Tag Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag.id)
                          ? prev.filter(id => id !== tag.id)
                          : [...prev, tag.id]
                      );
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-[#007CA6] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.name}
                    {selectedTags.includes(tag.id) && <X size={14} />}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="mt-4 text-sm text-[#007CA6] hover:text-[#00688d] font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-4">
        <p className="text-gray-600">
          Showing {packages.length} package{packages.length !== 1 ? 's' : ''}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Pricing Cards Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <PricingCard
              key={pkg.id}
              package={pkg}
              isPopular={pkg.is_featured && index < 3} // Make featured packages popular
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>

      <PlansOverview packages={packages} />
      <StillDeciding />

    </div>
  );
}