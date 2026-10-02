import { EvaluationResult } from '../types';
import { KNOWLEDGE_TOPICS } from '../data/mockData';

export const evaluateExplanation = async (topicId: string, userText: string): Promise<EvaluationResult> => {
  // Simulate intelligent evaluation latency
  await new Promise(resolve => setTimeout(resolve, 1400));

  const topic = KNOWLEDGE_TOPICS.find(t => t.id === topicId) || KNOWLEDGE_TOPICS[0];
  const lowerText = userText.toLowerCase();

  const words = userText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const detectedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  topic.sampleGoodTerms.forEach(term => {
    if (lowerText.includes(term.toLowerCase())) {
      detectedKeywords.push(term);
    } else {
      missingKeywords.push(term);
    }
  });

  // Calculate scores
  const keywordRatio = detectedKeywords.length / topic.sampleGoodTerms.length;

  // Length scoring (ideal: 50 - 200 words)
  let lengthFactor = 0.5;
  if (wordCount >= 20 && wordCount < 40) lengthFactor = 0.75;
  else if (wordCount >= 40 && wordCount <= 250) lengthFactor = 1.0;
  else if (wordCount > 250) lengthFactor = 0.85;

  const conceptAccuracy = Math.min(98, Math.max(45, Math.round((keywordRatio * 55 + lengthFactor * 40) + (Math.random() * 6 - 3))));
  const clarity = Math.min(96, Math.max(50, Math.round((lengthFactor * 50 + (wordCount > 30 ? 40 : 25)) + (Math.random() * 6 - 3))));
  const completeness = Math.min(95, Math.max(40, Math.round((keywordRatio * 70 + (wordCount > 50 ? 25 : 10)) + (Math.random() * 6 - 3))));

  const overallScore = Math.round((conceptAccuracy * 0.45) + (clarity * 0.25) + (completeness * 0.30));

  // Construct realistic critique
  let feedback = '';
  if (overallScore >= 85) {
    feedback = `Exceptional explanation! You synthesized the core intuitions with high precision. Your analogy communicated the concept clearly, and your breakdown of ${detectedKeywords.slice(0, 3).join(', ')} shows genuine mastery.`;
  } else if (overallScore >= 70) {
    if (topicId === 'grad-descent') {
      feedback = 'Good explanation. You correctly described the direction of optimization, but explain the learning rate more clearly. Mention what occurs if step size is too large or too small.';
    } else {
      feedback = `Solid conceptual foundation! You captured ${detectedKeywords.slice(0, 2).join(' and ')} well. To reach master tier, articulate how ${missingKeywords[0] || 'the key hyperparameter'} influences the system behavior.`;
    }
  } else {
    feedback = `Good start! However, your explanation is a bit sparse. Try introducing an everyday analogy and explicitly touch upon ${missingKeywords.slice(0, 3).join(', ')} to provide intuition.`;
  }

  const xpAwarded = overallScore >= 80 ? 120 : overallScore >= 60 ? 80 : 40;

  return {
    conceptAccuracy,
    clarity,
    completeness,
    overallScore,
    feedback,
    detectedKeywords,
    missingKeywords,
    xpAwarded
  };
};
