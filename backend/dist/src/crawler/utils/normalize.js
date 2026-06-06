"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = normalize;
exports.levenshtein = levenshtein;
exports.isSimilar = isSimilar;
exports.classifyCategory = classifyCategory;
exports.parseKoreanDate = parseKoreanDate;
exports.normalizeBrand = normalizeBrand;
function normalize(name) {
    return name
        .replace(/\s+/g, '')
        .toLowerCase()
        .replace(/[^\w가-힣]/g, '');
}
function levenshtein(a, b) {
    const dp = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] =
                a[i - 1] === b[j - 1]
                    ? dp[i - 1][j - 1]
                    : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[a.length][b.length];
}
function isSimilar(a, b, threshold = 2) {
    return levenshtein(normalize(a), normalize(b)) <= threshold;
}
function classifyCategory(name) {
    const n = name.toLowerCase();
    if (/초콜릿|가나|빼빼로|초코/.test(n))
        return '초콜릿';
    if (/칩|스낵|과자|팝|킥|볼/.test(n))
        return '스낵';
    if (/사탕|젤리|껌/.test(n))
        return '사탕/젤리';
    if (/쿠키|크래커|비스킷/.test(n))
        return '비스킷/쿠키';
    if (/아이스|빙과|콘|바|아이스크림/.test(n))
        return '빙과';
    if (/빵|케이크|파이|도넛|크림빵|모찌/.test(n))
        return '빵/케이크';
    if (/음료|스무디|주스|드링크|샷/.test(n))
        return '음료';
    return '스낵';
}
function parseKoreanDate(text) {
    const m1 = text.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
    if (m1)
        return new Date(`${m1[1]}-${m1[2].padStart(2, '0')}-${m1[3].padStart(2, '0')}`);
    const m2 = text.match(/(\d{4})[-.](\d{1,2})[-.](\d{1,2})/);
    if (m2)
        return new Date(`${m2[1]}-${m2[2].padStart(2, '0')}-${m2[3].padStart(2, '0')}`);
    return null;
}
const BRAND_ALIASES = {
    롯데: '롯데웰푸드',
    LOTTE: '롯데웰푸드',
    lotte: '롯데웰푸드',
    nongshim: '농심',
    orion: '오리온',
    binggrae: '빙그레',
    haitai: '해태',
};
function normalizeBrand(brand) {
    return BRAND_ALIASES[brand] ?? brand;
}
//# sourceMappingURL=normalize.js.map