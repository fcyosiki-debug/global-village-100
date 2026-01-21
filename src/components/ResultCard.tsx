'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

// カテゴリデータの型
interface CategoryData {
    label: string;
    percentage: number;
    color: string;
}

interface ResultCardProps {
    title: string;
    categories: CategoryData[];
    villageSize: number;
    generatedText: string;
    isLoading: boolean;
}

export default function ResultCard({
    title,
    categories,
    villageSize,
    generatedText,
    isLoading
}: ResultCardProps) {
    // 各カテゴリの人数を計算
    const categoryCounts = categories.map(cat => ({
        ...cat,
        count: Math.round((cat.percentage / 100) * villageSize)
    }));
    const totalHighlighted = categoryCounts.reduce((sum, cat) => sum + cat.count, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden"
        >
            {/* ヘッダー */}
            <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#AAFFA9]/10 px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#4ECDC4]" />
                    <h2 className="font-semibold text-slate-700">解説</h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">「{title}」について</p>
            </div>

            {/* コンテンツ */}
            <div className="p-6">
                {/* テキスト */}
                <div className="space-y-3">
                    {isLoading ? (
                        <div className="space-y-2">
                            <div className="h-4 bg-slate-100 rounded animate-pulse"></div>
                            <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6"></div>
                            <div className="h-4 bg-slate-100 rounded animate-pulse w-4/6"></div>
                        </div>
                    ) : (
                        <div className="prose prose-slate prose-sm max-w-none">
                            {generatedText.split('\n').map((paragraph, index) => (
                                paragraph.trim() && (
                                    <motion.p
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="text-slate-600 leading-relaxed"
                                    >
                                        {paragraph}
                                    </motion.p>
                                )
                            ))}
                        </div>
                    )}
                </div>

                {/* カテゴリ内訳 */}
                {!isLoading && categories.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-5 p-4 bg-gradient-to-r from-[#4ECDC4]/10 to-[#AAFFA9]/10 rounded-xl"
                    >
                        <div className="text-sm text-slate-600 mb-3 font-medium">内訳</div>
                        <div className="space-y-2">
                            {categoryCounts.map((cat, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <div className="flex-1 text-sm text-slate-600">{cat.label}</div>
                                    <div
                                        className="text-lg font-bold"
                                        style={{ color: cat.color }}
                                    >
                                        {cat.count}
                                    </div>
                                    <div className="text-sm text-slate-500">/{villageSize}人</div>
                                </div>
                            ))}
                        </div>

                        {/* 合計バー */}
                        <div className="mt-4 pt-3 border-t border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-500">合計</span>
                                <span className="text-sm font-semibold text-slate-700">{totalHighlighted}/{villageSize}人</span>
                            </div>
                            <div className="h-3 bg-slate-200 rounded-full overflow-hidden flex">
                                {categoryCounts.map((cat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(cat.count / villageSize) * 100}%` }}
                                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                                        className="h-full"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
