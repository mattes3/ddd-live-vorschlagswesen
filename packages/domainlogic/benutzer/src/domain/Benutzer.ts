import type { Branded } from '@vorschlagswesen/modellierung';

export type BenutzerId = Branded<string, 'BenutzerId'>;

// @Entity
export class Benutzer {
    constructor(
        public id: BenutzerId,
        public name: string,
        public email: string,
    ) {}
}
