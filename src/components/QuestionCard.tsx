import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaEye, FaComments, FaArrowUp } from 'react-icons/fa';

interface Question {
  _id: string;
  title: string;
  content: string;
  author: {
    _id?: string;
    name: string;
    username: string;
  };
  tags: string[];
  createdAt: string;
  views: number;
  answers: number;
  votes: number;
}

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all p-6">
      <Link to={`/questions/${question._id}`} className="block">
        <h3 className="text-xl font-bold text-black mb-3 hover:text-blue-600 transition-colors line-clamp-2">
          {question.title}
        </h3>
        
        <p className="text-zinc-600 mb-4 text-sm leading-relaxed">
          {truncateContent(question.content)}
        </p>

        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-blue-200 text-black text-xs font-semibold px-2 py-1 border border-black"
              >
                {tag}
              </span>
            ))}
            {question.tags.length > 3 && (
              <span className="text-zinc-500 text-xs">+{question.tags.length - 3} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
          <div className="flex items-center space-x-1">
            <FaUser size={12} />
            <span className="font-semibold text-black">
              {question.author?.name || 'Anonymous'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <FaCalendarAlt size={12} />
            <span>{formatDate(question.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-green-600">
              <FaArrowUp size={12} />
              <span className="font-semibold">{question.votes || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-600">
              <FaComments size={12} />
              <span className="font-semibold">{question.answers || 0}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-zinc-500">
            <FaEye size={12} />
            <span>{question.views || 0} views</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default QuestionCard;