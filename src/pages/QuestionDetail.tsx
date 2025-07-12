import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaEye, FaArrowUp, FaArrowDown, FaCheck, FaReply } from 'react-icons/fa';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../context/AuthContext';

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Mock data
  const mockQuestion = {
    _id: '1',
    title: 'How to implement JWT authentication in React?',
    content: '<p>I am trying to implement JWT authentication in my React application but facing issues with token storage and validation.</p><p>Here\'s what I\'ve tried so far:</p><ul><li>Storing token in localStorage</li><li>Using axios interceptors</li><li>Setting up protected routes</li></ul><p>But I\'m getting authentication errors. Can someone help me understand the proper way to implement this?</p>',
    author: { name: 'John Doe', username: 'johndoe', id: 'user1' },
    tags: ['react', 'jwt', 'authentication'],
    createdAt: '2024-01-15T10:30:00Z',
    views: 245,
    votes: 12,
    userVote: null // null, 'up', or 'down'
  };

  const mockAnswers = [
    {
      _id: 'ans1',
      content: '<p>Here\'s a comprehensive approach to implementing JWT authentication in React:</p><h3>1. Token Storage</h3><p>Store your JWT token in httpOnly cookies instead of localStorage for better security:</p><pre><code>// Set cookie on login\ndocument.cookie = `token=${token}; httpOnly; secure; sameSite=strict`;</code></pre><h3>2. Axios Setup</h3><p>Configure axios interceptors to automatically include the token:</p><pre><code>axios.interceptors.request.use((config) => {\n  const token = getTokenFromCookie();\n  if (token) {\n    config.headers.Authorization = `Bearer ${token}`;\n  }\n  return config;\n});</code></pre>',
      author: { name: 'Jane Smith', username: 'janesmith', id: 'user2' },
      createdAt: '2024-01-15T14:20:00Z',
      votes: 8,
      userVote: null,
      isAccepted: true
    },
    {
      _id: 'ans2',
      content: '<p>Another approach is to use React Context for managing authentication state:</p><pre><code>const AuthContext = createContext();\n\nconst AuthProvider = ({ children }) => {\n  const [user, setUser] = useState(null);\n  const [token, setToken] = useState(localStorage.getItem(\'token\'));\n\n  const login = async (credentials) => {\n    const response = await api.post(\'/login\', credentials);\n    setToken(response.data.token);\n    setUser(response.data.user);\n    localStorage.setItem(\'token\', response.data.token);\n  };\n\n  return (\n    <AuthContext.Provider value={{ user, token, login }}>\n      {children}\n    </AuthContext.Provider>\n  );\n};</code></pre>',
      author: { name: 'Mike Johnson', username: 'mikej', id: 'user3' },
      createdAt: '2024-01-15T16:45:00Z',
      votes: 5,
      userVote: null,
      isAccepted: false
    }
  ];

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQuestion(mockQuestion);
      setAnswers(mockAnswers);
      setLoading(false);
    };

    fetchQuestion();
  }, [id]);

  const handleVote = async (type: 'up' | 'down', targetType: 'question' | 'answer', targetId?: string) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }

    // Simulate API call
    console.log(`Voting ${type} on ${targetType}`, targetId);
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!user || user.id !== question?.author.id) {
      alert('Only the question author can accept answers');
      return;
    }

    // Simulate API call
    console.log('Accepting answer:', answerId);
    setAnswers(prev => prev.map(ans => ({
      ...ans,
      isAccepted: ans._id === answerId
    })));
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to answer');
      return;
    }

    if (!newAnswer.trim()) {
      alert('Please write an answer');
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const answer = {
        _id: `ans${Date.now()}`,
        content: newAnswer,
        author: { name: user.name, username: user.username, id: user.id },
        createdAt: new Date().toISOString(),
        votes: 0,
        userVote: null,
        isAccepted: false
      };
      
      setAnswers(prev => [...prev, answer]);
      setNewAnswer('');
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-400 border-4 border-black p-8 shadow-[8px_8px_0px_#000] max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-black mb-4">Question Not Found</h2>
          <Link
            to="/questions"
            className="bg-yellow-400 text-black border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
          >
            Back to Questions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Question */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-black mb-6">
            {question.title}
          </h1>

          <div className="flex items-center space-x-6 mb-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <FaUser size={14} />
              <span className="font-semibold text-black">{question.author.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaCalendarAlt size={14} />
              <span>{formatDate(question.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaEye size={14} />
              <span>{question.views} views</span>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            {/* Voting */}
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => handleVote('up', 'question')}
                className={`p-2 border-2 border-black hover:bg-green-200 transition-colors ${
                  question.userVote === 'up' ? 'bg-green-400' : 'bg-white'
                }`}
              >
                <FaArrowUp size={20} />
              </button>
              <span className="text-xl font-bold">{question.votes}</span>
              <button
                onClick={() => handleVote('down', 'question')}
                className={`p-2 border-2 border-black hover:bg-red-200 transition-colors ${
                  question.userVote === 'down' ? 'bg-red-400' : 'bg-white'
                }`}
              >
                <FaArrowDown size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div 
                className="prose prose-lg max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: question.content }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-200 text-black text-sm font-semibold px-3 py-1 border border-black"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">
            {answers.length} Answer{answers.length !== 1 ? 's' : ''}
          </h2>

          {answers.map((answer) => (
            <div
              key={answer._id}
              className={`bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6 mb-6 ${
                answer.isAccepted ? 'border-green-500 bg-green-50' : ''
              }`}
            >
              <div className="flex items-start space-x-6">
                {/* Voting */}
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={() => handleVote('up', 'answer', answer._id)}
                    className={`p-2 border-2 border-black hover:bg-green-200 transition-colors ${
                      answer.userVote === 'up' ? 'bg-green-400' : 'bg-white'
                    }`}
                  >
                    <FaArrowUp size={16} />
                  </button>
                  <span className="text-lg font-bold">{answer.votes}</span>
                  <button
                    onClick={() => handleVote('down', 'answer', answer._id)}
                    className={`p-2 border-2 border-black hover:bg-red-200 transition-colors ${
                      answer.userVote === 'down' ? 'bg-red-400' : 'bg-white'
                    }`}
                  >
                    <FaArrowDown size={16} />
                  </button>
                  
                  {/* Accept Answer */}
                  {user && user.id === question.author.id && (
                    <button
                      onClick={() => handleAcceptAnswer(answer._id)}
                      className={`p-2 border-2 border-black hover:bg-green-200 transition-colors ${
                        answer.isAccepted ? 'bg-green-400' : 'bg-white'
                      }`}
                      title={answer.isAccepted ? 'Accepted Answer' : 'Accept Answer'}
                    >
                      <FaCheck size={16} />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  {answer.isAccepted && (
                    <div className="bg-green-400 border-2 border-black px-3 py-1 inline-flex items-center space-x-1 mb-4">
                      <FaCheck size={14} />
                      <span className="font-bold text-black">Accepted Answer</span>
                    </div>
                  )}
                  
                  <div 
                    className="prose max-w-none mb-4"
                    dangerouslySetInnerHTML={{ __html: answer.content }}
                  />

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <FaUser size={12} />
                        <span className="font-semibold text-black">{answer.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaCalendarAlt size={12} />
                        <span>{formatDate(answer.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Answer */}
        {user ? (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-8">
            <h3 className="text-2xl font-bold text-black mb-6 flex items-center space-x-2">
              <FaReply />
              <span>Your Answer</span>
            </h3>
            
            <form onSubmit={handleSubmitAnswer}>
              <div className="mb-6">
                <RichTextEditor
                  content={newAnswer}
                  onChange={setNewAnswer}
                  placeholder="Write your answer here. Be detailed and helpful!"
                />
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-400 text-black border-2 border-black px-8 py-3 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Posting...' : 'Post Answer'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-yellow-100 border-4 border-black p-8 text-center shadow-[8px_8px_0px_#000]">
            <h3 className="text-2xl font-bold text-black mb-4">Want to Answer?</h3>
            <p className="text-black mb-6">You need to be logged in to post an answer.</p>
            <Link
              to="/auth"
              className="bg-blue-400 text-black border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
            >
              Login to Answer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;