import api from './api';

export interface Question {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    username: string;
  };
  tags: string[];
  votes: number;
  views: number;
  answers: string[];
  acceptedAnswer?: string;
  createdAt: string;
  updatedAt: string;
  answerCount?: number;
  voters?: Array<{
    user: string;
    vote: 'up' | 'down';
  }>;
}

export interface CreateQuestionData {
  title: string;
  content: string;
  tags: string[];
}

export interface QuestionsResponse {
  questions: Question[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface QuestionFilters {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  sort?: 'newest' | 'oldest' | 'votes' | 'views';
}

export const questionService = {
  async getQuestions(filters: QuestionFilters = {}): Promise<QuestionsResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.sort) params.append('sort', filters.sort);

    const response = await api.get(`/questions?${params.toString()}`);
    return response.data;
  },

  async getQuestion(id: string): Promise<Question> {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  async createQuestion(data: CreateQuestionData): Promise<Question> {
    const response = await api.post('/questions', data);
    return response.data;
  },

  async voteQuestion(id: string, voteType: 'up' | 'down'): Promise<{ votes: number }> {
    const response = await api.post(`/questions/${id}/vote`, { voteType });
    return response.data;
  }
};