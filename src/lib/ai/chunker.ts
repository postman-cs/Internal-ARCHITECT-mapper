export interface Chunk {
  content: string;
  tokenCount: number;
}

export function chunkText(text: string, maxTokens = 1000, overlap = 200): Chunk[] {
  const words = text.split(/\s+/);
  const chunks: Chunk[] = [];
  let i = 0;
  while (i < words.length) {
    const slice = words.slice(i, i + maxTokens);
    chunks.push({ content: slice.join(" "), tokenCount: slice.length });
    i += maxTokens - overlap;
  }
  return chunks.length ? chunks : [{ content: text, tokenCount: words.length }];
}
