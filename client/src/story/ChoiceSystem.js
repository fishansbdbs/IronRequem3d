import { CHOICES } from './storyData.js';

export function getDefaultChoices() {
  return CHOICES;
}

export function resolveChoice(choiceId) {
  return CHOICES.find((choice) => choice.id === choiceId) || CHOICES[0];
}
