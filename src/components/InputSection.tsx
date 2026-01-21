'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Percent, Hash, Plus, X, ChevronDown, ChevronRight, Bot, BookOpen } from 'lucide-react';
import { SAMPLES } from '@/lib/samples';

type Mode = 'percentage' | 'population';

// カテゴリデータの型
export interface CategoryData {
    id: string;
    label: string;
    value: string;
    color: string;
}

// 利用可能なカラーパレット
const CATEGORY_COLORS = [
    '#4ECDC4', // ティール
    '#FF6B6B', // コーラル
    '#95E1D3', // ミント
    '#F38181', // ピンク
    '#AA96DA', // ラベンダー
    '#FCBAD3', // ライトピンク
    '#A8D8EA', // スカイブルー
    '#FFD93D', // イエロー
    '#6BCB77', // グリーン
    '#C9B1FF', // パープル
];

// 村サイズの選択肢
const VILLAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200, 500, 1000];

interface InputSectionProps {
    onVisualize: (title: string, categories: { label: string; percentage: number; color: string }[], villageSize: number, names: string[], customText?: string, useAI?: boolean) => void;
    isLoading: boolean;
}

export default function InputSection({ onVisualize, isLoading }: InputSectionProps) {
    const [title, setTitle] = useState('');
    const [mode, setMode] = useState<Mode>('percentage');
    const [villageSize, setVillageSize] = useState(100);
    const [categories, setCategories] = useState<CategoryData[]>([
        { id: '1', label: '', value: '', color: CATEGORY_COLORS[0] }
    ]);
    // 詳細設定（AI・カスタム文章）アコーディオンの開閉状態
    const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
    // 入力された名前リスト
    const [nameListText, setNameListText] = useState('');
    // カスタム詩機能
    const [useCustomText, setUseCustomText] = useState(false);
    const [customText, setCustomText] = useState('');
    // AI文章生成モード
    const [useAI, setUseAI] = useState(false);

    // カテゴリを追加
    const addCategory = () => {
        if (categories.length >= 10) return; // 最大10カテゴリ
        const newColor = CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length];
        setCategories([
            ...categories,
            { id: Date.now().toString(), label: '', value: '', color: newColor }
        ]);
    };

    // カテゴリを削除
    const removeCategory = (id: string) => {
        if (categories.length <= 1) return; // 最低1つは必要
        setCategories(categories.filter(c => c.id !== id));
    };

    // カテゴリを更新
    const updateCategory = (id: string, field: 'label' | 'value', newValue: string) => {
        setCategories(categories.map(c =>
            c.id === id ? { ...c, [field]: newValue } : c
        ));
    };

    // パーセンテージの合計を計算
    const getTotalPercentage = () => {
        return categories.reduce((sum, cat) => {
            const numValue = parseFloat(cat.value.replace(/,/g, '')) || 0;
            if (mode === 'percentage') {
                return sum + numValue;
            } else {
                return sum + (numValue / 8_200_000_000) * 100;
            }
        }, 0);
    };


    // サンプル選択ハンドラ
    const handleSampleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sampleId = e.target.value;
        if (!sampleId) return;

        const sample = SAMPLES.find(s => s.id === sampleId);
        if (sample) {
            setTitle(sample.title);
            setCategories(sample.categories.map((c, i) => ({
                id: Date.now().toString() + i,
                label: c.label,
                value: c.value,
                color: c.color
            })));
            setVillageSize(100);
            setMode('percentage'); // サンプル値は基本的に人数(%)なので
            setUseCustomText(true);
            setCustomText(sample.customText);
            setUseAI(false);

            // 選択後、セレクトボックスをリセットするために空にする必要はないが、
            // ユーザーが「選んだ」感を持たせるためにそのままでも良い。
            // ただし、同じものを再度選びたい場合を考慮すると、stateで管理する必要があるかも。
            // 今回はシンプルにvalue={''}にして毎回選択させるスタイルにするか、
            // あるいは「現在選択中のサンプル」を表示するか。
            // シンプルに値変更時のみ発火するselectにして、valueは管理しない（常にplaceholder表示）形にする。
        }
    };

    const handleSubmit = () => {
        if (!title.trim()) return;
        if (categories.some(c => !c.label.trim() || !c.value.trim())) return;

        const processedCategories = categories.map(cat => {
            const numValue = parseFloat(cat.value.replace(/,/g, ''));
            let percentage: number;
            if (mode === 'percentage') {
                percentage = Math.min(100, Math.max(0, numValue));
            } else {
                // 人口を世界人口（82億）に対する割合に変換
                percentage = Math.min(100, Math.max(0, (numValue / 8_200_000_000) * 100));
            }
            return {
                label: cat.label,
                percentage,
                color: cat.color
            };
        });

        // 名前リストをパース（改行、カンマで分割し、空白を除去）
        const names = nameListText
            .split(/[\n,、\s]+/)
            .map(n => n.trim())
            .filter(n => n.length > 0);

        onVisualize(title, processedCategories, villageSize, names, useCustomText ? customText : undefined, useAI);
    };

    const formatPopulation = (value: string) => {
        const num = value.replace(/,/g, '');
        if (!num || isNaN(Number(num))) return value;
        return Number(num).toLocaleString();
    };

    const totalPercentage = getTotalPercentage();
    const isValid = title.trim() && categories.every(c => c.label.trim() && c.value.trim());

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg mx-auto"
        >
            {/* ヘッダー */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-4 shadow-sm"
                >
                    <Users className="w-5 h-5 text-[#4ECDC4]" />
                    <span className="text-sm font-medium text-slate-600">{villageSize}人の村シミュレーター</span>
                </motion.div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    世界を<span className="text-[#4ECDC4]">{villageSize}人の村</span>に
                </h1>
                <p className="text-slate-500 text-sm">
                    統計データを入力して、世界をもっと身近に感じてみましょう
                </p>
            </div>

            {/* カード */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50">

                {/* サンプル選択 */}
                <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        サンプルデータから選ぶ
                    </label>
                    <div className="relative">
                        <select
                            onChange={handleSampleSelect}
                            defaultValue=""
                            className="w-full appearance-none bg-white px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/20 outline-none transition-all text-sm cursor-pointer hover:border-blue-300"
                        >
                            <option value="" disabled>サンプルを選択してください...</option>
                            {SAMPLES.map((sample) => (
                                <option key={sample.id} value={sample.id}>
                                    {sample.title} - {sample.description}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* 村サイズ選択 */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        村の人数
                    </label>
                    {/* クイック選択ボタン */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {VILLAGE_SIZE_OPTIONS.map((size) => (
                            <button
                                key={size}
                                onClick={() => setVillageSize(size)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${villageSize === size
                                    ? 'bg-[#4ECDC4] text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {size}人
                            </button>
                        ))}
                    </div>
                    {/* 自由入力 */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">または</span>
                        <input
                            type="number"
                            min="1"
                            max="10000"
                            value={villageSize}
                            onChange={(e) => {
                                const value = Math.min(10000, Math.max(1, parseInt(e.target.value) || 1));
                                setVillageSize(value);
                            }}
                            className="w-24 px-3 py-2 rounded-lg border border-slate-200 focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/20 outline-none transition-all bg-white/50 text-center"
                        />
                        <span className="text-sm text-slate-500">人</span>
                    </div>

                    {/* 名前割り当てオプション（常時表示） */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            特定の名前を割り当てる
                        </label>
                        <div className="space-y-4">
                            <textarea
                                value={nameListText}
                                onChange={(e) => setNameListText(e.target.value)}
                                placeholder="例: 佐藤, 鈴木, 田中...（改行区切りも可）&#13;&#10;※入力した人数分だけランダムに割り当てられます"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/20 outline-none transition-all bg-white/50 placeholder-slate-400 text-sm h-24 resize-y"
                            />

                            {/* 詳細設定アコーディオン */}
                            <div className="pt-2">
                                <button
                                    onClick={() => setIsAdvancedSettingsOpen(!isAdvancedSettingsOpen)}
                                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#4ECDC4] transition-colors w-full text-left mb-2"
                                >
                                    {isAdvancedSettingsOpen ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                    その他の設定（AI・文章カスタマイズ）
                                </button>
                                <AnimatePresence>
                                    {isAdvancedSettingsOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="space-y-4 pt-2 pb-2">
                                                {/* AI文章生成モード */}
                                                <div className="pt-2 border-t border-slate-100">
                                                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={useAI}
                                                            onChange={(e) => {
                                                                setUseAI(e.target.checked);
                                                                if (e.target.checked) {
                                                                    setUseCustomText(false);
                                                                }
                                                            }}
                                                            className="w-4 h-4 rounded border-slate-300 text-[#4ECDC4] focus:ring-[#4ECDC4]/20"
                                                        />
                                                        <Bot className="w-4 h-4 text-[#4ECDC4]" />
                                                        Gemini AIで文章を生成する
                                                    </label>
                                                    <p className="text-xs text-slate-400 mt-1 ml-6">
                                                        ※オフの場合は定型文が表示されます
                                                    </p>
                                                </div>

                                                {/* 隠し機能: オリジナル詩の入力 */}
                                                <div className="pt-2 border-t border-slate-100">
                                                    <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={useCustomText}
                                                            onChange={(e) => setUseCustomText(e.target.checked)}
                                                            className="w-3.5 h-3.5 rounded border-slate-300 text-[#4ECDC4] focus:ring-[#4ECDC4]/20"
                                                        />
                                                        オリジナルの解説文を使用
                                                    </label>
                                                    <AnimatePresence>
                                                        {useCustomText && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <textarea
                                                                    value={customText}
                                                                    onChange={(e) => setCustomText(e.target.value)}
                                                                    placeholder="あなた自身の言葉で解説文を書いてください..."
                                                                    className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/20 outline-none transition-all bg-white/50 placeholder-slate-400 text-sm h-32 resize-y"
                                                                />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* タイトル入力 */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        テーマ・タイトル
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="例: 世界の宗教分布"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/20 outline-none transition-all bg-white/50 placeholder-slate-400"
                    />
                </div>

                {/* モード切替 */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        入力モード
                    </label>
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                        <button
                            onClick={() => setMode('percentage')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${mode === 'percentage'
                                ? 'bg-white text-[#4ECDC4] shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Percent className="w-4 h-4" />
                            パーセント
                        </button>
                        <button
                            onClick={() => setMode('population')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${mode === 'population'
                                ? 'bg-white text-[#4ECDC4] shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Hash className="w-4 h-4" />
                            人口
                        </button>
                    </div>
                </div>

                {/* カテゴリ入力リスト */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        カテゴリ
                    </label>
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex gap-2 items-center"
                                >
                                    {/* カラーインジケーター */}
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: category.color }}
                                    />

                                    {/* ラベル入力 */}
                                    <input
                                        type="text"
                                        value={category.label}
                                        onChange={(e) => updateCategory(category.id, 'label', e.target.value)}
                                        placeholder={`カテゴリ${index + 1}`}
                                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/20 outline-none transition-all bg-white/50 placeholder-slate-400 text-sm"
                                    />

                                    {/* 数値入力 */}
                                    <div className="relative w-28">
                                        <input
                                            type="text"
                                            value={category.value}
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/,/g, '');
                                                if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
                                                    updateCategory(category.id, 'value', mode === 'population' ? formatPopulation(raw) : raw);
                                                }
                                            }}
                                            placeholder={mode === 'percentage' ? '0' : '0'}
                                            className="w-full px-3 py-2 pr-8 rounded-lg border border-slate-200 focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/20 outline-none transition-all bg-white/50 placeholder-slate-400 text-sm"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                                            {mode === 'percentage' ? '%' : '人'}
                                        </span>
                                    </div>

                                    {/* 削除ボタン */}
                                    <button
                                        onClick={() => removeCategory(category.id)}
                                        disabled={categories.length <= 1}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* カテゴリ追加ボタン */}
                <button
                    onClick={addCategory}
                    disabled={categories.length >= 10}
                    className="w-full mb-4 py-2 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-[#4ECDC4] hover:text-[#4ECDC4] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" />
                    カテゴリを追加
                </button>

                {/* 合計表示 */}
                {categories.length > 1 && (
                    <div className={`mb-4 p-3 rounded-xl text-sm ${totalPercentage > 100 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
                        }`}>
                        合計: <span className="font-semibold">{Math.round(totalPercentage)}%</span>
                        {totalPercentage > 100 && ' (100%を超えています)'}
                    </div>
                )}

                {/* ボタン */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!isValid || isLoading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4ECDC4] to-[#44A3B5] text-white font-semibold shadow-lg shadow-[#4ECDC4]/25 hover:shadow-xl hover:shadow-[#4ECDC4]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <Sparkles className="w-5 h-5" />
                            </motion.div>
                            生成中...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            {villageSize}人の村を見る
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
}
