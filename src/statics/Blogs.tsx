import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import blogHero from '../assets/blogging.png';
import { fetchBlogPosts, type BlogPost } from '../api/blog';


const HeroSection = () => (
  <div className="relative w-full h-[300px] md:h-[550px] overflow-hidden bg-gray-100 flex items-center justify-center">
    {/* Background Image with Overlay */}
    <div className="absolute inset-0 z-0">
      <img 
        src={blogHero}
        alt="Creative Desk" 
        className="w-full h-full object-cover opacity-60"
      />
      {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60"></div> */}
    </div>

    {/* Content */}
    <div className="relative z-10 text-center px-4 max-w-4xl">
        {/* Artistic "BLOGGING" Text Background Effect */}
        {/* <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full justify-center items-center opacity-20 select-none pointer-events-none">
            <span className="text-[150px] font-black text-[#007CA6]">B</span>
            <span className="text-[150px] font-black text-[#FDB043]">L</span>
            <span className="text-[150px] font-black text-red-500">O</span>
            <span className="text-[150px] font-black text-green-500">G</span>
            <span className="text-[150px] font-black text-purple-500">G</span>
            <span className="text-[150px] font-black text-[#007CA6]">I</span>
            <span className="text-[150px] font-black text-orange-500">N</span>
            <span className="text-[150px] font-black text-red-500">G</span>
        </div> */}

        <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-md mb-4 relative">
          Our Blogs: Creative Stories <br className="hidden md:block"/> & Design Inspiration
        </h1>
        <p className="text-white font-medium text-sm md:text-base drop-shadow-md max-w-2xl mx-auto">
          Explore How Color, Imagination, And Storytelling Shape Every Project We Create. 
          Discover Ideas, Case Studies, And Behind-The-Scenes Moments From The Kids Design Company Team.
        </p>
    </div>
  </div>
);

const MainArticle = ({ post }: { post: BlogPost }) => (
  <section className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">
    {/* Header Block */}
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center mb-12">
        <div className="w-full md:w-1/2">
            <img
                src={post.featured_image || "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop"}
                alt={post.title}
                className="rounded-2xl shadow-lg w-full h-64 md:h-72 object-cover"
            />
        </div>
        <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
            </h2>
            <div className="text-gray-500 text-sm md:text-base font-medium">
                Posted &nbsp;•&nbsp; {new Date(post.publish_date || post.created_at).toLocaleDateString()}
            </div>
        </div>
    </div>

    {/* Content Block */}
    <div className="prose max-w-none text-gray-600 leading-relaxed text-sm md:text-base">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  </section>
);

interface BlogCardProps {
    image: string;
    tag: string;
    date: string;
    title: string;
    excerpt: string;
}

const BlogCard = ({ image, tag, date, title, excerpt }: BlogCardProps) => (
    <div className="flex flex-col">
        <div className="relative h-48 rounded-xl overflow-hidden mb-4">
            <img src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex justify-between items-center text-xs mb-3">
            <span className="bg-[#007CA6] text-white px-3 py-1 rounded-full">{tag}</span>
            <span className="text-gray-500">{date}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{excerpt}</p>
    </div>
);

const SimilarBlogs = ({ posts }: { posts: BlogPost[] }) => {
    return (
        <section className="max-w-6xl mx-auto px-6 md:px-12 pb-20">
            <div className="mb-8">
                 <h2 className="text-3xl font-bold text-gray-800">Similar Blogs</h2>
            </div>

            <div className="relative">
                {/* Navigation Arrows (Desktop) */}
                <button className="hidden lg:flex absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md items-center justify-center border border-gray-100 text-[#007CA6] hover:bg-gray-50 z-10">
                    <ChevronLeft size={24}/>
                </button>
                <button className="hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md items-center justify-center border border-gray-100 text-[#007CA6] hover:bg-gray-50 z-10">
                    <ChevronRight size={24}/>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, _index) => (
                        <BlogCard
                            key={post.id}
                            image={post.featured_image || "https://images.unsplash.com/photo-1571210862729-78a52d3779a2?q=80&w=1000&auto=format&fit=crop"}
                            tag={post.category?.name || "General"}
                            date={new Date(post.publish_date || post.created_at).toLocaleDateString()}
                            title={post.title}
                            excerpt={post.excerpt || post.content.substring(0, 100) + "..."}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTASection = () => (
    <section className="bg-[#F9FAFB] py-16 md:py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Let's Help you Design a World Kids Would Love
            </h2>
            <p className="text-gray-600 mb-8 text-sm md:text-base">
                From Cozy Corners To Creative Classrooms—Start Your Custom Journey Today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-[#007CA6] hover:bg-[#00688d] text-white px-8 py-3 rounded-md font-semibold text-sm transition-colors shadow-sm">
                    Start Shopping Now
                </button>
                <button className="bg-[#FDB043] hover:bg-[#e59b32] text-gray-900 px-8 py-3 rounded-md font-semibold text-sm transition-colors shadow-sm">
                    Book Consultation
                </button>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export default function Blogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchBlogPosts({ page_size: 10 });
        setPosts(data.results);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="font-sans min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007CA6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  const mainPost = posts[0];
  const similarPosts = posts.slice(1, 4);

  return (
    <div className="font-sans min-h-screen bg-white">
      <HeroSection />
      {mainPost && <MainArticle post={mainPost} />}
      <SimilarBlogs posts={similarPosts} />
      <CTASection />
    </div>
  );
}