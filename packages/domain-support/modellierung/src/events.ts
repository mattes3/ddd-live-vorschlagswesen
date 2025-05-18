export type DomainEvent<Typ extends string, DetailTyp> = {
    aufgetreten: Date;
    typ: Typ;
    detail: DetailTyp;
};

export function createEvent<Typ extends string, DetailTyp>(
    typ: Typ,
    detail: DetailTyp,
): DomainEvent<Typ, DetailTyp> {
    return { aufgetreten: new Date(), typ, detail };
}
