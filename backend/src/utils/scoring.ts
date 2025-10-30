type AnswerOption = { tags: string[]; weight: number };
type Answer =
  | { type: 'fill'; value: string }
  | { type: 'tf' | 'mcq' | 'multi'; options: AnswerOption[] };

export type CareerMap = Record<string, string[]>;

export function findTagsFromKeywords(text: string, keywords: Record<string, string[]>): string[] {
  const tags = new Set<string>();
  const words = text.split(/[^a-z0-9]+/g).filter(Boolean);
  for (const word of words) {
    const mapped = keywords[word];
    if (mapped) mapped.forEach((t) => tags.add(t));
  }
  return Array.from(tags);
}

export function calculateCareerResults(answers: Answer[], careerMap: CareerMap, keywords: Record<string, string[]>) {
  const tagScores: Record<string, number> = {};

  for (const ans of answers) {
    if (ans.type === 'fill') {
      const norm = ans.value.trim().toLowerCase();
      const matchedTags = findTagsFromKeywords(norm, keywords);
      for (const tag of matchedTags) tagScores[tag] = (tagScores[tag] || 0) + 2;
    } else {
      for (const opt of ans.options) {
        for (const tag of opt.tags) tagScores[tag] = (tagScores[tag] || 0) + opt.weight;
      }
    }
  }

  const results = Object.entries(careerMap).map(([careerName, tags]) => {
    const score = tags.reduce((sum, tag) => sum + (tagScores[tag] || 0), 0);
    return { careerName, score };
  });

  return { tagScores, results: results.sort((a, b) => b.score - a.score).slice(0, 5) };
}


