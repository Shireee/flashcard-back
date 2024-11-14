export type Example = {
  item: string;
  itemReveal: string;
};

export type Flashcard = {
  id: number;
  Img: string;
  item: string;
  itemReveal: string;
  examples: Example[];
  repeatNumber: number;
  nextRepeat: number;
  metrika: Record<string, unknown>;
};
