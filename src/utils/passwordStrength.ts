import zxcvbn from 'zxcvbn';

export const isStrongPassword = (password: string, minScore = 3): boolean => {
  const result = zxcvbn(password);
  return result.score >= minScore;
};