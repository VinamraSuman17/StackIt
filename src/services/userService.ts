import api from './api';
import type { User } from './authService';
import type { Question } from './questionService';
import type { Answer } from './answerService';

export interface UserProfile {
  user: User;
  questions: Question[];
  answers: Answer[];
}

export interface UpdateProfileData {
  name: string;
  username: string;
}

export const userService = {
  async getUserProfile(id: string): Promise<UserProfile> {
    const response = await api.get(`/users/profile/${id}`);
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  async getLeaderboard(): Promise<User[]> {
    const response = await api.get('/users/leaderboard');
    return response.data;
  }
};