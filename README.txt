Fuzzy Company Name Matching

A TypeScript-based fuzzy matching algorithm designed to support financial transaction reconciliation by comparing company names despite minor spelling, formatting, and word-order differences.

Logic:
1. Lowercase text, remove punctuation and corporate suffixes, and standardize whitespace. Cache cleaned strings for efficiency.
2. Calculate normalized Levenshtein similarity for both the original strings and alphabetically sorted word sequences.
3. Return the higher similarity score, ranging from 0.0 to 1.0.

Limitations:
Scores indicate textual similarity, not match probability. Thresholds require validation against labeled data, and similar company names may produce false positives.
