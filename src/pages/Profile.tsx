import React from 'react';
import { FaUser, FaQuestionCircle, FaComments, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { Question } from '../services/questionService';
import { Answer } from '../services/answerService';

const Profile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const profile = await userService.getUserProfile(user.id);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-400 border-4 border-black p-8 shadow-[8px_8px_0px_#000] max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-black mb-4">Access Denied</h2>
          <p className="text-black">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="bg-blue-400 p-6 border-2 border-black shadow-[4px_4px_0px_#000]">
              <FaUser size={48} className="text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-black mb-2">{user.name}</h1>
              <p className="text-lg text-gray-600 mb-2">@{user.username}</p>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                <FaCalendarAlt size={12} />
                <span>Member since {new Date(userProfile?.user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-200 border-2 border-black p-6 text-center shadow-[6px_6px_0px_#000]">
            <FaQuestionCircle size={32} className="mx-auto mb-2 text-black" />
            <div className="text-2xl font-bold text-black">{userProfile?.user?.questionsAsked || 0}</div>
            <div className="text-sm text-gray-600">Questions Asked</div>
          </div>
          
          <div className="bg-blue-200 border-2 border-black p-6 text-center shadow-[6px_6px_0px_#000]">
            <FaComments size={32} className="mx-auto mb-2 text-black" />
            <div className="text-2xl font-bold text-black">{userProfile?.user?.answersGiven || 0}</div>
            <div className="text-sm text-gray-600">Answers Given</div>
          </div>
          
          <div className="bg-yellow-200 border-2 border-black p-6 text-center shadow-[6px_6px_0px_#000]">
            <FaTrophy size={32} className="mx-auto mb-2 text-black" />
            <div className="text-2xl font-bold text-black">{userProfile?.user?.reputation || 0}</div>
            <div className="text-sm text-gray-600">Reputation</div>
          </div>
          
          <div className="bg-purple-200 border-2 border-black p-6 text-center shadow-[6px_6px_0px_#000]">
            <FaUser size={32} className="mx-auto mb-2 text-black" />
            <div className="text-2xl font-bold text-black">Active</div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Questions */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-6">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center space-x-2">
              <FaQuestionCircle />
              <span>Recent Questions</span>
            </h2>
            
            {userProfile?.questions?.length > 0 ? (
              <div className="space-y-4">
                {userProfile.questions.slice(0, 5).map((question: Question) => (
                  <div key={question._id} className="border-2 border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-bold text-black mb-2">{question.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{question.votes} votes</span>
                      <span>{question.answers?.length || 0} answers</span>
                      <span>{question.views} views</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No questions asked yet.</p>
            )}
          </div>

          {/* Recent Answers */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-6">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center space-x-2">
              <FaComments />
              <span>Recent Answers</span>
            </h2>
            
            {userProfile?.answers?.length > 0 ? (
              <div className="space-y-4">
                {userProfile.answers.slice(0, 5).map((answer: Answer & { question: { title: string } }) => (
                  <div key={answer._id} className="border-2 border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-bold text-black mb-2">{answer.question?.title}</h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">{answer.votes} votes</span>
                      {answer.isAccepted && (
                        <span className="bg-green-400 text-black px-2 py-1 border border-black text-xs font-bold">
                          ACCEPTED
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No answers given yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;