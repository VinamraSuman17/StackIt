import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../context/AuthContext';
import { FaQuestionCircle, FaTags, FaEdit } from 'react-icons/fa';
import { questionService } from '../services/questionService';

const AskQuestion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // Available tags options
  const tagOptions = [
    { value: 'react', label: 'React' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'css', label: 'CSS' },
    { value: 'html', label: 'HTML' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'sql', label: 'SQL' },
    { value: 'express', label: 'Express.js' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'php', label: 'PHP' },
    { value: 'laravel', label: 'Laravel' },
    { value: 'django', label: 'Django' },
    { value: 'flask', label: 'Flask' },
    { value: 'jwt', label: 'JWT' },
    { value: 'authentication', label: 'Authentication' },
    { value: 'api', label: 'API' },
  ];

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      border: '2px solid black',
      boxShadow: '4px 4px 0px #000',
      borderRadius: 0,
      minHeight: '48px',
      '&:hover': {
        border: '2px solid black',
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#60a5fa',
      border: '1px solid black',
      borderRadius: 0,
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: 'black',
      fontWeight: 'bold',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: 'black',
      '&:hover': {
        backgroundColor: '#ef4444',
        color: 'white',
      },
    }),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!title.trim() || !description.trim() || selectedTags.length === 0) {
      alert('Please fill in all fields and select at least one tag.');
      return;
    }

    setLoading(true);
    
    try {
      await questionService.createQuestion({
        title,
        content: description,
        tags: selectedTags.map((tag: any) => tag.value)
      });
      
      navigate('/questions');
    } catch (error) {
      console.error('Error posting question:', error);
      alert(error.response?.data?.message || 'Failed to post question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-400 border-4 border-black p-8 shadow-[8px_8px_0px_#000] max-w-md mx-auto">
          <FaQuestionCircle size={48} className="mx-auto mb-4 text-black" />
          <h2 className="text-2xl font-bold text-black mb-4">Login Required</h2>
          <p className="text-black mb-6">You need to be logged in to ask a question.</p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-yellow-400 text-black border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-blue-400 p-3 border-2 border-black shadow-[4px_4px_0px_#000]">
              <FaQuestionCircle size={24} className="text-black" />
            </div>
            <h1 className="text-4xl font-black text-black">Ask a Question</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label className="flex items-center space-x-2 text-lg font-bold text-black mb-3">
                <FaEdit />
                <span>Question Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your programming question? Be specific and clear."
                className="w-full p-4 border-2 border-black shadow-[4px_4px_0px_#000] focus:shadow-[6px_6px_0px_#000] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all text-black font-medium"
                maxLength={200}
              />
              <p className="text-sm text-gray-600 mt-2">
                {title.length}/200 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center space-x-2 text-lg font-bold text-black mb-3">
                <FaEdit />
                <span>Description</span>
              </label>
              <RichTextEditor
                content={description}
                onChange={setDescription}
                placeholder="Provide more details about your question. Include what you've tried, expected results, and any error messages."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="flex items-center space-x-2 text-lg font-bold text-black mb-3">
                <FaTags />
                <span>Tags</span>
              </label>
              <Select
                isMulti
                value={selectedTags}
                onChange={setSelectedTags}
                options={tagOptions}
                styles={customSelectStyles}
                placeholder="Select relevant tags (e.g., React, JavaScript, Node.js)"
                className="text-black"
              />
              <p className="text-sm text-gray-600 mt-2">
                Add up to 5 tags to help others find and answer your question.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={() => navigate('/questions')}
                className="bg-gray-400 text-black border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-green-400 text-black border-2 border-black px-8 py-3 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post Question'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;