declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
export type Branded<T, B> = T & Brand<B>;

// Alle ID-Typen müssen "branded" sein so dass man sie nicht verwechseln kann.
// So ist z.B. eine UserId inkompatibel mit einer AccountId oder irgendeiner
// anderen "branded ID".

// Der TypeScript-Compiler wird das prüfen.
// https://egghead.io/blog/using-branded-types-in-typescript
