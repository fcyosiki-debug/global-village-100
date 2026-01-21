
// InputSection.tsxと同じ定義を使用するために型を合わせる
export interface SampleData {
    id: string;
    title: string;
    description: string;
    categories: {
        label: string;
        value: string;
        color: string;
    }[];
    customText: string;
}

const COLORS = [
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

export const SAMPLES: SampleData[] = [
    {
        id: 'sample1',
        title: '世界の言葉',
        description: '言語の分布',
        categories: [
            { label: '中国語', value: '17', color: COLORS[1] },
            { label: '英語', value: '8', color: COLORS[0] },
            { label: 'ヒンディー語', value: '8', color: COLORS[7] },
            { label: 'スペイン語', value: '7', color: COLORS[3] },
            { label: 'ロシア語', value: '4', color: COLORS[4] },
            { label: 'アラビア語', value: '4', color: COLORS[8] },
            { label: 'その他の言語', value: '52', color: COLORS[2] },
        ],
        customText: `17人は中国語をしゃべり、8人は英語を。
8人はヒンディー語を。7人はスペイン語を。
4人はロシア語を、4人はアラビア語をしゃべります。
これでようやく。村人の半分です。
あとの半分は、ベンガル語、ポルトガル語、
インドネシア語、日本語、
ドイツ語、フランス語などをしゃべります。`
    },
    {
        id: 'sample2',
        title: '栄養の状態',
        description: '栄養と健康',
        categories: [
            { label: '栄養不足', value: '13', color: COLORS[7] },
            { label: '瀕死の状態', value: '1', color: COLORS[1] },
            { label: '太りすぎ', value: '14', color: COLORS[3] },
            { label: '標準的', value: '72', color: COLORS[2] },
        ],
        customText: `村に住む人びとの100人のうち。
14人は栄養がじゅうぶんではなく、
1人は死にそうなほどです。
でも14人は太りすぎです。`
    },
    {
        id: 'sample3',
        title: '住環境と水',
        description: '住居と水の確保',
        categories: [
            { label: '雨露をしのげる', value: '82', color: COLORS[2] },
            { label: 'そうではない', value: '18', color: COLORS[1] },
        ],
        customText: `82人は食べ物の蓄えがあり、
雨露をしのぐところがあります。
でも、あとの18人はそうではありません。
その18人は、きれいで安全な水を飲めません。`
    },
    {
        id: 'sample4',
        title: '世界の富',
        description: '貧富の差',
        categories: [
            { label: '最も豊か', value: '8', color: COLORS[7] },
            { label: 'その他', value: '92', color: COLORS[2] },
        ],
        customText: `銀行に預金があり、財布にお金があり、
家のどこかに小銭が転がっているなら
あなたはいちばん豊かな8人のうちの1人です。
自分の車をもっているなら
いちばん豊かな7人の1人です。`
    },
    {
        id: 'sample5',
        title: '教育と識字',
        description: '教育レベル',
        categories: [
            { label: '大学教育あり', value: '1', color: COLORS[0] },
            { label: 'ネット利用', value: '18', color: COLORS[6] },
            { label: '文字が読めない', value: '20', color: COLORS[1] },
            { label: 'その他', value: '61', color: COLORS[2] },
        ],
        customText: `村人のうち、1人が大学の教育を受け、
18人がインターネットを使っています。
けれど、20人は文字が読めません。`
    },
    {
        id: 'sample6',
        title: '自由と権利',
        description: '良心の自由',
        categories: [
            { label: '自由がある', value: '52', color: COLORS[2] },
            { label: '自由がない', value: '48', color: COLORS[1] },
        ],
        customText: `もしもあなたがいやがらせや
逮捕や拷問や死を恐れずに、
信仰や信条、良心に従ってなにかをし、
ものが言えるなら、
そうではない48人より恵まれています。`
    },
];
