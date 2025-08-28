import React from 'react';
import { useParams } from 'react-router-dom';
import GenericChapterSectionQuiz from '../Data/GenericChapterSectionQuiz';

// Wrapper component whose only job is to read the dynamic URL params
// and pass them as the expected init* props to the quiz component.
export default function GenericChapterSectionQuizRoute() {
  const { book, chStart, chEnd } = useParams();

  // Decode / parse with sensible fallbacks
  const initBookName = book ? decodeURIComponent(book) : 'John';
  const firstNum = parseInt(chStart, 10);
  const lastNum = parseInt(chEnd, 10);
  const initFirstChapter = isNaN(firstNum) ? 1 : firstNum;
  const initLastChapter = isNaN(lastNum) ? 5 : lastNum;

  return (
    <GenericChapterSectionQuiz
      initBookName={initBookName}
      initFirstChapter={initFirstChapter}
      initLastChapter={initLastChapter}
    />
  );
}
