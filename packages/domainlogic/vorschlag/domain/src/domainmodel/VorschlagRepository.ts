import { TechError } from '@vorschlagswesen/modellierung';
import type { AsyncResult, Option } from 'ts-results-es';

// Using .js extensions for ESM compliance with TypeScript's nodenext moduleResolution
import type { Vorschlag, VorschlagData } from './Vorschlag.js';
import { VorschlagsZustand } from './VorschlagTypes.js';

// @Repository
export interface VorschlagRepository {
    findVorschlaegeByZustand(params: {
        zustand: VorschlagsZustand;
    }): AsyncResult<Vorschlag[], TechError>;

    add(params: { item: VorschlagData }): AsyncResult<void, TechError>;

    get(params: { id: Vorschlag['id'] }): AsyncResult<Option<Vorschlag>, TechError>;

    update(params: {
        id: Vorschlag['id'];
        updates: Partial<Omit<VorschlagData, 'id'>>;
    }): AsyncResult<void, TechError>;

    remove(params: { item: VorschlagData }): AsyncResult<void, TechError>;
}
