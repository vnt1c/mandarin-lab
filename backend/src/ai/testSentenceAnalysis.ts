import dotenv from 'dotenv';
dotenv.config();

async function run() {
  // Use dynamic import to ensure dotenv.config() runs first
  const { analyzeChineseSentence } = await import("./chineseSentenceAnalysis.service");
  
  const result = await analyzeChineseSentence(
    "请把这些盒子按照从大到小的顺序排列。"
  );
  console.dir(result, { depth: null });
}

run().catch(console.error);
