import { Vorschlag } from './Vorschlag.js';

export interface VorschlagRepository {
    add(vorschlag: Vorschlag): Promise<void>;
    getAll(): Promise<Vorschlag[]>;
}
