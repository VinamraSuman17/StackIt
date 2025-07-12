import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { FaSearch, FaFilter, FaPlus, FaSort } from 'react-icons/fa';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterTag, setFilterTag] = useState('');

  // Mock data - replace with actual API call
  const mockQuestions = [
    {
      _id: '1',
      title: 'How to implement JWT authentication in React?',
      content: 'I am trying to implement JWT authentication in my React application but facing issues with token storage and validation.',
      author: { name: 'John Doe', username: 'johndoe' },
      tags: ['react', 'jwt', 'authentication'],
      createdAt: '2024-01-15T10:30:00Z',
      views: 245,
      answers: 3,
      votes: 12
    },
    {
      _id: '2',
      title: 'Best practices for MongoDB schema design?',
      content: 'What are the best practices when designing schemas for MongoDB? Should I embed documents or use references?',
      author: { name: 'Jane Smith', username: 'janesmith' },
      tags: ['mongodb', 'database', 'schema'],
      createdAt: '2024-01-14T15:45:00Z',
      views: 189,
      answers: 5,
      votes: 8
    },
    {
      _id: '3',
      title: 'How to handle async/await in JavaScript?',
      content: 'I am confused about how async/await works in JavaScript. Can someone explain with examples?',
      author: { name: 'Mike Johnson', username: 'mikej' },
      tags: ['javascript', 'async', 'promises'],
      createdAt: '2024-01-13T09:20:00Z',
      views: 156,
      answers: 2,
      votes: 15
    },
    {
      _id: '4',
      title: 'CSS Grid vs Flexbox - When to use which?',
      content: 'I am learning CSS layout techniques. When should I use CSS Grid and when should I use Flexbox?',
      author: { name: 'Sarah Wilson', username: 'sarahw' },
      tags: ['css', 'grid', 'flexbox'],
      createdAt: '2024-01-12T14:10:00Z',
      views: 203,
      answers: 4,
      votes: 10
    },
    {
      _id: '5',
      title: 'How to optimize React app performance?',
      content: 'My React application is getting slow. What are the best practices to optimize React app performance?',
      author: { name: 'David Brown', username: 'davidb' },
      tags: ['react', 'performance', 'optimization'],
      createdAt: '2024-01-11T11:30:00Z',
      views: 178,
      answers: 6,
      votes: 18
    },
    {
      _id: '6',
      title: 'Understanding Node.js event loop',
      content: 'Can someone explain how the Node.js event loop works? I am having trouble understanding the concept.',
      author: { name: 'Lisa Garcia', username: 'lisag' },
      tags: ['nodejs', 'event-loop', 'javascript'],
      createdAt: '2024-01-10T16:45:00Z',
      views: 134,
      answers: 3,
      votes: 7
    }
  ];

  const availableTags = ['react', 'javascript', 'nodejs', 'mongodb', 'css', 'jwt', 'authentication', 'database', 'performance'];

  useEffect(() => {
    // Simulate API call
    const fetchQuestions = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQuestions(mockQuestions);
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  const filteredQuestions = questions
    .filter(question => 
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(question => 
      filterTag === '' || question.tags.includes(filterTag)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'votes':
          return b.votes - a.votes;
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-black shadow-[4px_4px_0px_#000] focus:shadow-[6px_6px_0px_#000] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
            />
          </div>

          {/* Tag Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
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
              onChange={(e) => setSortBy(e.target.value)}
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
          {loading ? 'Loading...' : `${filteredQuestions.length} question${filteredQuestions.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
        </div>
      ) : filteredQuestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))}
        </div>
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