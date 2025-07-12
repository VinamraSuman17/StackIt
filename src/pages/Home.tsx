import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import { FaSearch, FaStar, FaUsers, FaQuestionCircle, FaComments, FaEye } from "react-icons/fa";

const HeroSection = () => (
  <section className="bg-amber-50 border-black pt-10">
    <div className="container mx-auto px-4 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-3 gap-14 items-center">
      <div className="text-center col-span-2">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-black mb-6">
          Ask. Answer. Learn Together.
        </h1>
        <p className="text-lg md:text-xl text-zinc-700 max-w-xl mx-auto lg:mx-0 mb-10">
          Join our vibrant community of learners and experts. Get answers to your questions and help others solve theirs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link
            to="/ask-question"
            className="inline-block bg-green-400 text-black border-2 border-black px-8 py-4 text-lg font-bold shadow-[8px_8px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all"
          >
            Ask a Question
          </Link>
          <Link
            to="/questions"
            className="inline-block bg-blue-400 text-black border-2 border-black px-8 py-4 text-lg font-bold shadow-[8px_8px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all"
          >
            Browse Questions
          </Link>
        </div>
      </div>
      <div className="hidden lg:flex justify-center items-center">
        <div className="bg-lime-200 p-4 border-4 border-black shadow-[12px_12px_0px_#000]">
          <div className="h-80 w-80 bg-yellow-300 border-2 border-black flex items-center justify-center">
            <FaQuestionCircle size={120} className="text-black" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="py-16 md:py-24 bg-lime-200 border-y-4 border-black">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-black">How StackIt Works</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<FaSearch size={40} />}
          title="Search & Discover"
          description="Find answers to your questions instantly. Use our powerful search and filter system to discover relevant discussions."
        />
        <FeatureCard
          icon={<FaStar size={40} />}
          title="Ask & Share"
          description="Post detailed questions with rich formatting. Share your knowledge by providing helpful answers to the community."
        />
        <FeatureCard
          icon={<FaUsers size={40} />}
          title="Engage & Connect"
          description="Vote on the best answers, accept solutions, and build your reputation within our growing community of learners."
        />
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white p-8 border-2 border-black text-center shadow-[8px_8px_0px_#000]">
    <div className="flex justify-center mb-4 text-black">{icon}</div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-zinc-600">{description}</p>
  </div>
);

const StatsSection = () => (
  <section className="py-16 md:py-24 bg-blue-200 border-y-4 border-black">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-black">Growing Community</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard number="10K+" label="Questions Asked" />
        <StatCard number="25K+" label="Answers Given" />
        <StatCard number="5K+" label="Active Users" />
        <StatCard number="50+" label="Topics Covered" />
      </div>
    </div>
  </section>
);

const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div className="bg-white p-6 border-2 border-black text-center shadow-[6px_6px_0px_#000]">
    <div className="text-3xl font-black text-black mb-2">{number}</div>
    <div className="text-zinc-600 font-semibold">{label}</div>
  </div>
);

const FinalCTASection = () => (
  <section className="py-16 md:py-24 bg-amber-50">
    <div className="container mx-auto px-4">
      <div className="bg-yellow-400 text-center p-10 border-4 border-black shadow-[8px_8px_0px_#000]">
        <h2 className="text-4xl md:text-5xl font-black text-black mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-black max-w-2xl mx-auto mb-8">
          Join thousands of learners and experts. Create your free account and start participating in our knowledge-sharing community today.
        </p>
        <Link
          to="/auth"
          className="inline-block bg-green-400 text-black border-2 border-black px-10 py-4 text-lg font-bold shadow-[6px_6px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all"
        >
          Join StackIt Now
        </Link>
      </div>
    </div>
  </section>
);

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock trending questions data
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
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchTrendingQuestions = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setQuestions(mockQuestions);
      } catch (err) {
        setError("Failed to load trending questions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingQuestions();
  }, []);

  return (
    <div className="bg-amber-50 min-h-screen">
      <HeroSection />
      
      {/* Trending Questions Section */}
      <section className="py-12 md:py-20 bg-white border-y-4 border-black">
        <div className="container mx-auto px-4">
          {loading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-400 border-4 border-black text-black font-bold p-4 my-4 shadow-[8px_8px_0px_#000]">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && questions.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl md:text-5xl font-black text-black">
                  Trending Questions
                </h2>
                <Link to="/questions" className="hidden md:inline-block font-bold text-black underline hover:text-blue-600 transition-colors">
                  View All Questions →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions.map((question) => (
                  <QuestionCard key={question._id} question={question} />
                ))}
              </div>

              <div className="text-center mt-10">
                <Link
                  to="/questions"
                  className="inline-block bg-blue-400 text-black border-2 border-black px-8 py-3 font-bold shadow-[6px_6px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all"
                >
                  Explore All Questions
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      
      <FeaturesSection />
      <StatsSection />
      <FinalCTASection />
    </div>
  );
};

export default Home;