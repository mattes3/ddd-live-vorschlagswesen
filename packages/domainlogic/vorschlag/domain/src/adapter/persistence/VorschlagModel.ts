import { Model } from 'objection';

import { Vorschlag } from '../../domainmodel/Vorschlag.js';

// TypeScript Declaration merging takes place here, by design!
// See https://www.typescriptlang.org/docs/handbook/declaration-merging.html
export interface VorschlagModel extends Omit<Vorschlag, 'moeglicherZeitrahmen'> {
    moeglicherZeitrahmenVon: Date;
    moeglicherZeitrahmenBis: Date;
}
export class VorschlagModel extends Model {
    static override tableName = 'vorschlagswesen.vorschlaege';
    static override idColumn = 'id';

    // Timestamps handling
    override $beforeInsert() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    override $beforeUpdate() {
        this.updatedAt = new Date().toISOString();
    }
}
