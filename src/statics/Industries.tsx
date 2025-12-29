import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { fetchPastProjects, fetchProjectCategories, type PastProject, type ProjectCategory } from '../api/pastProjects';


interface ProjectCardProps {
  project: PastProject;
}

const ProjectCard = ({ project }: ProjectCardProps) => (
  <div className="bg-white flex flex-col items-center text-center mb-12">
    <div className="w-full aspect-[4/3] overflow-hidden rounded-3xl mb-6">
      <img src={project.image1} alt={project.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-6 px-4">
      {project.short_description || project.description}
    </p>
    {project.location && (
      <p className="text-gray-500 text-sm mb-2">📍 {project.location}</p>
    )}
    {project.completion_date && (
      <p className="text-gray-500 text-sm mb-4">
        Completed: {new Date(project.completion_date).toLocaleDateString()}
      </p>
    )}
    <button className="bg-white border border-[#087CA7] text-[#087CA7] px-10 py-3 rounded-full font-semibold hover:bg-[#087CA7] hover:text-white transition-all">
      See This Project
    </button>
  </div>
);

interface SectionHeaderProps {
  title: string;
  linkText?: string;
}

const SectionHeader = ({ title, linkText }: SectionHeaderProps) => (
  <div className="mb-8 mt-12">
    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">{title}</h2>
    <div className="h-1.5 w-40 bg-[#087CA7] rounded-full mb-4"></div>
    {linkText && (
      <a href="#" className="text-[#087CA7] font-medium hover:underline flex items-center gap-1">
        {linkText} <ChevronRight size={16} />
      </a>
    )}
  </div>
);


export default function Industries() {
  const [projects, setProjects] = useState<PastProject[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [projectsData, categoriesData] = await Promise.all([
          fetchPastProjects({ page_size: 20 }),
          fetchProjectCategories()
        ]);
        setProjects(projectsData.results);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProjects = selectedCategory
    ? projects.filter(project => project.category.slug === selectedCategory)
    : projects;

  const projectsByCategory = categories.reduce((acc, category) => {
    acc[category.slug] = filteredProjects.filter(project => project.category.slug === category.slug);
    return acc;
  }, {} as Record<string, PastProject[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007CA6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading past projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-gray-500 text-sm mb-2">Industries we Work with</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            Get to Know the Industries we Design For
          </h1>
          <p className="text-gray-600 leading-relaxed mb-8">
            From Classrooms To Hospitals And Kid Brands, Our Designs Create Colorful Spaces And Experiences Where Children Can Feel Safe, Inspired, And Free To Express Themselves.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#087CA7] hover:bg-[#066a8f] text-white px-8 py-3 rounded-md font-semibold transition-colors">
              Shop Now
            </button>
            <button className="bg-[#FDB043] hover:bg-[#e59b32] text-gray-900 px-8 py-3 rounded-md font-semibold transition-colors">
              Book Consultation
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-[#087CA7] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Projects
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.slug
                    ? 'bg-[#087CA7] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Projects by Category */}
        {categories.map(category => {
          const categoryProjects = projectsByCategory[category.slug] || [];
          if (categoryProjects.length === 0) return null;

          return (
            <div key={category.id} className="mb-16">
              <SectionHeader
                title={category.name}
                linkText={`See all ${category.name} projects`}
              />
              <div className="space-y-8">
                {categoryProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Show all projects if no category selected */}
        {!selectedCategory && projects.length > 0 && (
          <div className="mb-16">
            <SectionHeader title="All Projects" />
            <div className="space-y-8">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          </div>
        )}

        {/* No projects message */}
        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-gray-500">No projects found in this category.</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Let's Help you Design a World Kids Would Love
          </h2>
          <p className="text-gray-600 mb-8">
            From Cozy Corners To Creative Classrooms—Start Your Custom Journey Today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#087CA7] hover:bg-[#066a8f] text-white px-10 py-3 rounded-md font-semibold transition-colors shadow-lg">
              Shop Now
            </button>
            <button className="bg-[#FDB043] hover:bg-[#e59b32] text-gray-900 px-10 py-3 rounded-md font-semibold transition-colors shadow-lg">
              Book Consultation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}