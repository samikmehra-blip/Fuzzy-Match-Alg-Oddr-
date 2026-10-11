import * as levenshtein from 'fast-levenshtein';

const PUNCTUATION_REGEX = /[^a-z0-9\s]/g;
const CORP_SUFFIX_REGEX = /\b(corp|inc|ltd|llc|gmbh|co|incorporated|limited)\b/g;
const SPACES_REGEX = /\s+/g;

const cleanCache = new Map<string, string>(); // Built-in cache for fast lookup

interface Invoice
{
    id: string;
    customerName: string;
    amount: number;
}

interface Transaction
{
    entryReference: string;
    amount: number; //First match
    proprietaryText: string; //Fuzzy match
    senderName: string; //Fallback fuzzy match
}

export function cleanString(text: string): string 
{
    if(!text) return "";

    if (cleanCache.has(text)) 
    {
        return cleanCache.get(text)!;
    }

    const cleaned = text
        .toLowerCase() //Lowercasing
        .replace(PUNCTUATION_REGEX, ' ') //Punctuation removing
        .replace(CORP_SUFFIX_REGEX, '') //Suffix remover
        .replace(SPACES_REGEX, ' ') //Excess space removing
        .trim(); //Trimming

    cleanCache.set(text, cleaned); // Save cleaned result to cache before returning

    return cleaned;
}


export function calculateFuzzyScore(
    str1: string,
    str2: string
): number {
    const s1 = cleanString(str1);
    const s2 = cleanString(str2);

    if (s1 === s2) return 1.0;
    if (!s1 || !s2) return 0.0;

    // Character-level similarity
    const charDistance = levenshtein.get(s1, s2);
    const charScore =
        1 - charDistance / Math.max(s1.length, s2.length);

    // Word-order-insensitive comparison
    const sorted1 = s1.split(" ").sort().join(" ");
    const sorted2 = s2.split(" ").sort().join(" ");

    const sortedDistance = levenshtein.get(sorted1, sorted2);
    const sortedScore =
        1 - sortedDistance /
        Math.max(sorted1.length, sorted2.length);

    return Math.max(charScore, sortedScore);
}
