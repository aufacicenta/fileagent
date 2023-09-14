export type CandidatesPrediction = { candidates: Array<{ content: string }> };

export type ContentPrediction = { content: string };

export type GoogleAIPrediction = CandidatesPrediction | ContentPrediction;
