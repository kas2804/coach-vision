export interface FeedbackItem {
  id: string;
  playerId: string;
  playerName: string;
  date: string;
  skill: string;
  feedback: string;
  coach: string;
  acknowledged: boolean;
}

// Get all feedback from localStorage
export const getAllFeedback = (): FeedbackItem[] => {
  try {
    const stored = localStorage.getItem('playerFeedback');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading feedback:', error);
    return [];
  }
};

// Get feedback for a specific player
export const getPlayerFeedback = (playerName: string): FeedbackItem[] => {
  const allFeedback = getAllFeedback();
  return allFeedback.filter(item => item.playerName === playerName);
};

// Add new feedback
export const addFeedback = (feedback: Omit<FeedbackItem, 'id' | 'date'>): void => {
  try {
    const allFeedback = getAllFeedback();
    const newFeedback: FeedbackItem = {
      ...feedback,
      id: `${feedback.playerId}-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    
    const updatedFeedback = [newFeedback, ...allFeedback];
    localStorage.setItem('playerFeedback', JSON.stringify(updatedFeedback));
  } catch (error) {
    console.error('Error saving feedback:', error);
  }
};

// Update feedback acknowledgment
export const acknowledgeFeedback = (feedbackId: string): void => {
  try {
    const allFeedback = getAllFeedback();
    const updatedFeedback = allFeedback.map(item =>
      item.id === feedbackId ? { ...item, acknowledged: true } : item
    );
    localStorage.setItem('playerFeedback', JSON.stringify(updatedFeedback));
  } catch (error) {
    console.error('Error updating feedback:', error);
  }
};

// Initialize with some default feedback if none exists
export const initializeFeedback = (): void => {
  const existing = getAllFeedback();
  // No default feedback - system starts clean
};