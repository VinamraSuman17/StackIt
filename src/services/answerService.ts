import api from './api';

export interface Answer {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    username: string;
  };
  question: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  voters?: Array<{
    user: string;
    vote: 'up' | 'down';
  }>;
}

export interface CreateAnswerData {
  content: string;
  questionId: string;
}

export const answerService = {
  async getAnswers(questionId: string): Promise<Answer[]> {
    const response = await api.get(`/answers/question/${questionId}`);
    return response.data;
  },

  async createAnswer(data: CreateAnswerData): Promise<Answer> {
    const response = await api.post('/answers', data);
    return response.data;
  },

  async voteAnswer(id: string, voteType: 'up' | 'down'): Promise<{ votes: number }> {
    const response = await api.post(`/answers/${id}/vote`, { voteType });
    return response.data;
  },

  async acceptAnswer(id: string): Promise<{ message: string }> {
    const response = await api.post(`/answers/${id}/accept`);
    return response.data;
  }
};