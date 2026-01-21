'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ChevronLeft } from 'lucide-react';
import InputSection from '@/components/InputSection';
import PersonGrid from '@/components/PersonGrid';
import ResultCard from '@/components/ResultCard';
import { generateText, getDefaultText } from '@/lib/api';

// カテゴリデータの型
interface CategoryData {
  label: string;
  percentage: number;
  color: string;
}

interface VisualizationState {
  title: string;
  categories: CategoryData[];
  villageSize: number;
  generatedText: string;
  assignedNames: { [index: number]: string };
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isGridAnimating, setIsGridAnimating] = useState(false);
  const [visualization, setVisualization] = useState<VisualizationState | null>(null);

  const handleVisualize = useCallback(async (title: string, categories: CategoryData[], villageSize: number, names: string[], customText?: string, useAI?: boolean) => {
    setIsLoading(true);
    setShowResults(true);
    setIsGridAnimating(true);

    // 合計パーセンテージを計算
    const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);

    // 名前の割り当て（ランダム）
    const assignedNames: { [index: number]: string } = {};
    if (names.length > 0) {
      // 0からvillageSize-1までのインデックス配列を作成
      const indices = Array.from({ length: villageSize }, (_, i) => i);
      // シャッフル
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      // 名前を割り当て
      names.forEach((name, i) => {
        if (i < indices.length) {
          assignedNames[indices[i]] = name;
        }
      });
    }

    // 初期状態をセット
    setVisualization({
      title,
      categories,
      villageSize,
      generatedText: '',
      assignedNames,
    });

    // カテゴリ説明を作成
    const categoryDescription = categories.map(c => `${c.label}: ${c.percentage}%`).join('、');

    // API呼び出し（カスタムテキストがあればスキップ、AIモードオフなら定型文）
    try {
      let text: string;
      if (customText) {
        // カスタムテキストを使用
        text = customText;
      } else if (useAI) {
        // AIモードがオンの場合はGemini APIを呼び出し
        text = await generateText(`${title}（${categoryDescription}）`, categories, villageSize);
      } else {
        // デフォルト: 定型文を使用
        text = getDefaultText(title, categories, villageSize);
      }

      // テキスト生成完了を反映
      setVisualization({
        title,
        categories,
        villageSize,
        generatedText: text,
        assignedNames,
      });
    } catch (error) {
      console.error('API Error:', error);
      setVisualization({
        title,
        categories,
        villageSize,
        generatedText: 'データの生成中にエラーが発生しました。もう一度お試しください。',
        assignedNames,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGridAnimationComplete = useCallback(() => {
    setIsGridAnimating(false);
  }, []);

  const handleReset = useCallback(() => {
    setShowResults(false);
    setVisualization(null);
  }, []);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center min-h-[80vh]"
            >
              <InputSection onVisualize={handleVisualize} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* 戻るボタン */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6"
              >
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm text-slate-600 hover:bg-white/80 transition-all shadow-sm border border-white/50 hover:shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                  別のデータを試す
                </button>
              </motion.div>

              {/* タイトル表示 */}
              {visualization && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                    {visualization.title}
                  </h1>
                  <p className="text-slate-500 mt-2">
                    世界を{visualization.villageSize}人の村に縮めるとどうなるでしょう
                  </p>
                </motion.div>
              )}

              {/* 結果グリッド */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* 左側: グリッド */}
                {visualization && (
                  <PersonGrid
                    categories={visualization.categories}
                    villageSize={visualization.villageSize}
                    isAnimating={isGridAnimating}
                    onAnimationComplete={handleGridAnimationComplete}
                    assignedNames={visualization.assignedNames}
                  />
                )}

                {/* 右側: 結果カード */}
                {visualization && (
                  <ResultCard
                    title={visualization.title}
                    categories={visualization.categories}
                    villageSize={visualization.villageSize}
                    generatedText={visualization.generatedText}
                    isLoading={isLoading}
                  />
                )}
              </div>

              {/* もう一度ボタン */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-center mt-8"
              >
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#4ECDC4] to-[#44A3B5] text-white font-semibold shadow-lg shadow-[#4ECDC4]/25 hover:shadow-xl hover:shadow-[#4ECDC4]/30 transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  別のデータを試す
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
