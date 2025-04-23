import Fuse from "fuse.js";

let fuse = null;

export function initFuzzySearch(products) {
    fuse = new Fuse(products, {
        keys: [
            "name",
            "description",
            "includedDevices",
            "includedPackages"
        ],
        includeScore: true,
        threshold: 0.4,
        minMatchCharLength: 2,
        ignoreLocation: true
    });
}

export function matchProductsHybrid(products, input) {
    if (!fuse) return [];

    const fuzzyResults = fuse.search(input);

    // Nếu fuzzy ra kết quả tốt → ưu tiên
    if (fuzzyResults.length > 0) {
        const bestScore = fuzzyResults[0].score;
        const similar = fuzzyResults.filter(r => Math.abs(r.score - bestScore) < 0.05);

        // Nếu kết quả fuzzy đủ rõ ràng → trả về
        if (similar.length <= 5) {
            return similar.map(r => r.item);
        }
    }

    // Nếu fuzzy trả quá nhiều hoặc không đủ rõ → fallback sang matchProducts() logic cũ
    const words = input
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length >= 2);

    const scored = products.map((p) => {
        const name = p.name?.toLowerCase() || "";
        const desc = p.description?.toLowerCase() || "";
        const deviceList = (p.includedDevices || []).map(d => d.toLowerCase());
        const packageList = (p.includedPackages || []).map(pkg => pkg.toLowerCase());

        const fullText = [name, desc, ...deviceList, ...packageList].join(" ");
        const matchedWords = words.filter(w => fullText.includes(w));

        return {
            product: p,
            score: matchedWords.length / words.length
        };
    });

    const maxScore = Math.max(...scored.map(s => s.score), 0);
    const matched = scored
        .filter(s => s.score >= Math.max(0.6, maxScore - 0.05))
        .map(s => s.product);

    return matched;
}

// export function matchProducts(products, sentence) {
//     const words = sentence
//         .toLowerCase()
//         .replace(/[^\w\s]/g, "") // remove punctuation
//         .split(/\s+/);

//     return products.filter((p) => {
//         const name = p.name?.toLowerCase() || "";
//         const desc = p.description?.toLowerCase() || ""; // match cơ bản với name + description

//         const baseMatch = words.some((w) => name.includes(w) || desc.includes(w)); // nếu là combo → check thêm includedDevices & includedPackages

//         const comboMatch =
//             (p.includedDevices || []).some((d) =>
//                 words.some((w) => d.toLowerCase().includes(w))
//             ) ||
//             (p.includedPackages || []).some((pkg) =>
//                 words.some((w) => pkg.toLowerCase().includes(w))
//             );

//         return baseMatch || comboMatch;
//     });
// }
