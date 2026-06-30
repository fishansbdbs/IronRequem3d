import { CHOICES } from './storyData.js';

export function getDialogueChoices(crewId, state) {
  const choices = CHOICES[crewId]?.[state.currentChapter] || [];
  return choices.filter((choice) => !state.dialogueChoices?.[choice.conversationId]);
}

export function getDefaultChoices() {
  return [];
}

export function resolveChoice(crewId, state, choiceId) {
  const choices = getDialogueChoices(crewId, state);
  return choices.find((choice) => choice.choiceId === choiceId) || choices[0];
}
