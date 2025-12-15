export interface SeoAnalysis {
  wordCount: number;
  hasH1: boolean;
  titleLength: number;
  descriptionLength: number;
  keywordCount: number;
  score: number;
  feedback: {
    title: string;
    description: string;
    content: string;
  };
}
export function analyzeSeo(
  markdown: string,
  title: string,
  description: string,
  keywords: string
): SeoAnalysis {
  const wordCount = (markdown.match(/\b\w+\b/g) || []).length;
  const hasH1 = /^#\s/m.test(markdown);
  const titleLength = title.length;
  const descriptionLength = description.length;
  const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);
  const keywordCount = keywordList.length;
  let score = 0;
  const feedback = {
    title: 'Looks good.',
    description: 'Looks good.',
    content: 'Looks good.',
  };
  // Title analysis
  if (titleLength > 10 && titleLength < 60) {
    score += 25;
  } else {
    feedback.title = 'Title should be between 10 and 60 characters.';
  }
  // Description analysis
  if (descriptionLength > 50 && descriptionLength < 160) {
    score += 25;
  } else {
    feedback.description = 'Description should be between 50 and 160 characters.';
  }
  // Content analysis
  if (hasH1) {
    score += 20;
  } else {
    feedback.content = 'Content should have at least one H1 heading (e.g., # My Title).';
  }
  if (wordCount > 300) {
    score += 15;
  } else if (feedback.content === 'Looks good.') {
    feedback.content = 'Content is a bit short. Aim for 300+ words for better SEO.';
  }
  if (keywordCount > 0) {
    score += 15;
  } else if (feedback.content === 'Looks good.') {
    feedback.content = 'Add some keywords to improve targeting.';
  }
  return {
    wordCount,
    hasH1,
    titleLength,
    descriptionLength,
    keywordCount,
    score: Math.min(100, score),
    feedback,
  };
}