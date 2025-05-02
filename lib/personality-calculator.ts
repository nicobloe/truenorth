import type { TestQuestion } from "./questions"
import {
  calculateDimensionScores as calculateDimensionScoresOriginal,
  determinePersonalityType as determinePersonalityTypeOriginal,
} from "./personality-types"

// Recalculate personality dimensions based on test results
export function calculateDimensionScores(results: number[], testQuestions?: TestQuestion[]) {
  return calculateDimensionScoresOriginal(results, testQuestions)
}

// Determine personality type based on dimension scores
export function determinePersonalityType(results: number[], testQuestions?: TestQuestion[]) {
  return determinePersonalityTypeOriginal(results, testQuestions)
}
