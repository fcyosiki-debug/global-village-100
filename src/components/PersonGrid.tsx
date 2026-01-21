'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

// カテゴリデータの型
interface CategoryData {
    label: string;
    percentage: number;
    color: string;
}

interface PersonGridProps {
    categories: CategoryData[];
    villageSize: number;
    isAnimating: boolean;
    onAnimationComplete?: () => void;
    assignedNames?: { [index: number]: string };
}

export default function PersonGrid({ categories, villageSize, isAnimating, onAnimationComplete, assignedNames }: PersonGridProps) {
    const [animatedCount, setAnimatedCount] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // 各カテゴリの開始・終了インデックスを計算（村サイズに基づく）
    const categoryRanges = categories.reduce((acc, cat, index) => {
        const start = index === 0 ? 0 : acc[index - 1].end;
        const count = Math.round((cat.percentage / 100) * villageSize);
        const end = Math.min(start + count, villageSize);
        acc.push({ ...cat, start, end, count });
        return acc;
    }, [] as (CategoryData & { start: number; end: number; count: number })[]);

    const totalHighlighted = categoryRanges.length > 0
        ? categoryRanges[categoryRanges.length - 1].end
        : 0;

    // 人物のインデックスに対応するカテゴリを取得
    const getCategoryForPerson = (index: number): (CategoryData & { count: number }) | null => {
        for (const range of categoryRanges) {
            if (index >= range.start && index < range.end) {
                return range;
            }
        }
        return null;
    };

    // グリッドの列数を村サイズに基づいて計算
    const getGridCols = () => {
        if (villageSize <= 20) return 5;
        if (villageSize <= 50) return 10;
        if (villageSize <= 100) return 10;
        if (villageSize <= 200) return 14;
        if (villageSize <= 500) return 20;
        return 25;
    };

    const gridCols = getGridCols();

    // アイコンサイズを村サイズに基づいて調整
    const getIconSize = () => {
        if (villageSize <= 50) return 'w-full h-full';
        if (villageSize <= 100) return 'w-full h-full';
        if (villageSize <= 200) return 'w-4 h-4';
        if (villageSize <= 500) return 'w-3 h-3';
        return 'w-2 h-2';
    };

    useEffect(() => {
        if (isAnimating) {
            setAnimatedCount(0);
            let count = 0;
            const animSpeed = Math.max(5, Math.floor(1000 / villageSize));
            const interval = setInterval(() => {
                count++;
                setAnimatedCount(count);
                if (count >= totalHighlighted) {
                    clearInterval(interval);
                    onAnimationComplete?.();
                }
            }, animSpeed);

            return () => clearInterval(interval);
        }
    }, [isAnimating, totalHighlighted, onAnimationComplete, villageSize]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50"
        >
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-700">
                    {villageSize}人の村
                </h2>
            </div>

            {/* 凡例 */}
            <div className="flex flex-wrap gap-3 mb-4 text-sm">
                {categoryRanges.map((cat, index) => (
                    <span key={index} className="flex items-center gap-1">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-slate-600">{cat.label}: {cat.count}人</span>
                    </span>
                ))}
                {villageSize - totalHighlighted > 0 && (
                    <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-slate-300" />
                        <span className="text-slate-500">その他: {villageSize - totalHighlighted}人</span>
                    </span>
                )}
            </div>

            {/* グリッド */}
            <div
                className="grid gap-1"
                style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
            >
                {Array.from({ length: villageSize }).map((_, index) => {
                    const category = getCategoryForPerson(index);
                    const isHighlighted = category !== null;
                    const isAnimated = isAnimating ? index < animatedCount : isHighlighted;
                    const name = assignedNames ? assignedNames[index] : undefined;

                    return (
                        <div
                            key={index}
                            className="relative group"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* ツールチップ */}
                            {name && (hoveredIndex === index) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-10 pointer-events-none"
                                >
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800" />
                                    {name}
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                }}
                                transition={{
                                    delay: Math.min(index * 0.005, 0.5),
                                    duration: 0.2,
                                }}
                                className={`relative flex flex-col items-center justify-center transition-all duration-300 ${name ? 'z-10' : ''}`}
                            >
                                <div className="aspect-square w-full flex items-center justify-center rounded-full">
                                    <motion.div
                                        animate={isAnimated && isHighlighted ? {
                                            scale: [1, 1.1, 1],
                                        } : {}}
                                        transition={{ duration: 0.2 }}
                                        className="cursor-default"
                                    >
                                        <User
                                            className={`${getIconSize()} transition-colors duration-300`}
                                            style={{
                                                color: isAnimated && isHighlighted && category
                                                    ? category.color
                                                    : '#CBD5E1',
                                                filter: isAnimated && isHighlighted && category
                                                    ? `drop-shadow(0 0 2px ${category.color}50)`
                                                    : 'none'
                                            }}
                                            strokeWidth={villageSize > 200 ? 2 : 1.5}
                                        />
                                    </motion.div>
                                </div>
                                {/* 名前表示（アイコンの下） */}
                                {name && (
                                    <span className="text-[8px] leading-none text-slate-700 font-medium -mt-1.5 max-w-full truncate text-center">
                                        {name}
                                    </span>
                                )}
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            {/* 統計情報 */}
            <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex flex-wrap justify-center gap-4 text-center">
                    {categoryRanges.map((cat, index) => (
                        <div key={index}>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: cat.color }}
                            >
                                {cat.count}
                            </div>
                            <div className="text-xs text-slate-500">{cat.label}</div>
                        </div>
                    ))}
                    {villageSize - totalHighlighted > 0 && (
                        <>
                            <div className="w-px bg-slate-200" />
                            <div>
                                <div className="text-2xl font-bold text-slate-400">{villageSize - totalHighlighted}</div>
                                <div className="text-xs text-slate-500">その他</div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
