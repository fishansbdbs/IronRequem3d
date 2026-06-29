import { CHAPTERS } from '../data/chapters.js';

export class ChapterManager {
  getCurrentChapter(state) {
    return CHAPTERS.find((chapter) => chapter.id === state.currentChapter) || CHAPTERS[0];
  }

  getChapterLabel(state) {
    return this.getCurrentChapter(state).label;
  }
}
