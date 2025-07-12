import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { FaSearch, FaFilter, FaPlus, FaSort } from 'react-icons/fa';
import { questionService, Question } from '../services/questionService';

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterTag, setFilterTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);


  const availableTags = ['react', 'javascript', 'nodejs', 'mongodb', 'css', 'jwt', 'authentication', 'database', 'performance'];

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await questionService.getQuestions({
          page: currentPage,
          limit: 12,
          search: searchTerm || undefined,
          tag: filterTag || undefined,
          sort: sortBy as any
        });
        
        setQuestions(response.questions);
        setTotalPages(response.totalPages);
        setTotal(response.total);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentPage, searchTerm, filterTag, sortBy]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterTag(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-black mb-4 md:mb-0">
          All Questions
        </h1>
        <Link
          to="/ask-question"
          className="bg-green-400 text-black border-2 border-black px-6 py-3 font-bold shadow-[6px_6px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all inline-flex items-center space-x-2"
        >
          <FaPlus size={16} />
          <span>Ask Question</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-black shadow-[4px_4px_0px_#000] focus:shadow-[6px_6px_0px_#000] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
            />
          </div>

          {/* Tag Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              value={filterTag}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-black shadow-[4px_4px_0px_#000] focus:shadow-[6px_6px_0px_#000] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all appearance-none bg-white"
            >
              <option value="">All Tags</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-black shadow-[4px_4px_0px_#000] focus:shadow-[6px_6px_0px_#000] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all appearance-none bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="votes">Most Voted</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-lg font-semibold text-black">
          {loading ? 'Loading...' : `${total} question${total !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
        </div>
      ) : questions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={{
                ...question,
                answers: question.answers?.length || 0
              }} />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-12">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-blue-400 text-black border-2 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-black font-bold">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-blue-400 text-black border-2 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="bg-yellow-100 border-4 border-black p-8 shadow-[8px_8px_0px_#000] max-w-md mx-auto">
            <FaSearch size={48} className="mx-auto mb-4 text-gray-500" />
            <h3 className="text-2xl font-bold text-black mb-2">No Questions Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterTag 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Be the first to ask a question!'}
            </p>
            <Link
              to="/ask-question"
              className="bg-green-400 text-black border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all inline-flex items-center space-x-2"
            >
              <FaPlus size={16} />
              <span>Ask First Question</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;