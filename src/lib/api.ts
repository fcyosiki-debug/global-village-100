import { GoogleGenerativeAI } from '@google/generative-ai';

// 世界人口（2024年推定値）
export const WORLD_POPULATION = 8_200_000_000;

// 人口からパーセントを計算
export function calculatePercentage(population: number): number {
    return Math.round((population / WORLD_POPULATION) * 100);
}

// カテゴリデータの型定義（api.ts内でも使えるように）
export interface CategoryData {
    label: string;
    percentage: number;
    color: string;
}

// Gemini SDKでテキスト生成
export async function generateText(title: string, categories: CategoryData[], villageSize: number = 100): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

    // 村サイズに応じた人数を計算し、文字列化
    const categoryDetails = categories.map(cat => {
        const count = Math.round((cat.percentage / 100) * villageSize);
        return `${cat.label}は${count}人`;
    }).join('、');

    // 合計人数（その他を含む場合があるため計算）
    const totalCount = categories.reduce((sum, cat) => sum + Math.round((cat.percentage / 100) * villageSize), 0);
    const otherCount = villageSize - totalCount;
    const allDetails = otherCount > 0
        ? `${categoryDetails}、その他の人は${otherCount}人`
        : categoryDetails;

    // APIキーがない場合はデモテキストを返す
    if (!apiKey) {
        return getDemoText(title, categories, villageSize);
    }

    // APIキーがない場合はデモテキストを返す
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // 2.0 Flashを使用

        const prompt = `あなたは詩人であり、教育者です。
「${title}」というテーマについて、世界を${villageSize}人の村に例えて、優しく語りかけるような文章を書いてください。
以下の統計データを使ってください：
${allDetails}

スタイルと構成の指示：
1. 導入：
   「世界には82億人の人がいますが、もしもそれを${villageSize}人の村に縮めるとどうなるでしょう。」という言葉から始めてください。

2. 本文（2〜3段落）：
   - 提供された数値データを「〇〇人は〜、△△人は〜」といった形で具体的に文章に組み込んでください。
   - 単なる数字の羅列ではなく、詩的なリズムを持たせてください。
   - 例文のトーンを参考にしてください：
     「17人は中国語をしゃべり、8人は英語を。
       8人はヒンディー語を。7人はスペイン語を。
       （中略）
       これでようやく。村人の半分です。」

3. 結びのメッセージ：
   - 最後に、多様性、共感、愛、平和などをテーマにした、読者の心に響くメッセージを書いてください。
   - 以下の例文のような、自己愛と他者愛、そして未来への希望を感じさせる内容にしてください：
     「まずあなたが愛してください。あなた自身と、人がこの村に生きてあるということを。
       もしもたくさんのわたし・たちがこの村を愛することを知ったならまだ間に合います。
       きっと」

文体：
- 漢字を使いすぎず、子供でも読めるような優しい言葉遣い
- 行間を感じさせるような、ゆったりとした語り口
- 読者に「あなた」と語りかけるスタイル`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text() || 'テキストの生成に失敗しました。';
    } catch (error) {
        console.error('Gemini SDK error:', error);
        // エラー時はデモテキストを返す
        return getDemoText(title, categories, villageSize);
    }
}

// デモ用テキスト
function getDemoText(title: string, categories: CategoryData[], villageSize: number): string {
    const categoryDetails = categories.map(cat => {
        const count = Math.round((cat.percentage / 100) * villageSize);
        return `${count}人は${cat.label}を`;
    }).join('、');

    return `世界には82億人の人がいますが、もしもそれを${villageSize}人の村に縮めるとどうなるでしょう。

${categoryDetails}。
それぞれの違いを持って、この村で暮らしています。

数字で見ると少なく感じるかもしれませんが、それぞれがかけがえのない1人です。

まずあなたが愛してください。
あなた自身と、人がこの村に生きてあるということを。
きっと、そこから世界は変わります。`;
}
