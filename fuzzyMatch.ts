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
        .replace(PUNCTUATION_REGEX, '') //Punctuation removing
        .replace(CORP_SUFFIX_REGEX, '') //Suffix remover
        .replace(SPACES_REGEX, ' ') //Excess space removing
        .trim(); //Trimming

    cleanCache.set(text, cleaned); // Save cleaned result to cache before returning

    return cleaned;
}

export function calculateFuzzyScore(str1: string, str2: string)
{
    const s1 = cleanString(str1); //Cleans string 1
    const s2 = cleanString(str2); //Cleans string 2

    if(s1 == s2) return 1.0; //If perfect match, return 100% confidence
    if(s1.length == 0 || s2.length == 0) return 0.0; //If one string is missing/empty, reutn 0% confidence

    const distance = levenshtein.get(s1, s2); 
    const maxLength = Math.max(s1.length, s2.length);

    return 1.0 - (distance/maxLength); //Returns difference in string
}