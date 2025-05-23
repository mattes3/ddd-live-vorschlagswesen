import { Model } from 'objection';
import { withTransactionFor } from '@vorschlagswesen/database';

import { createVorschlag, type VorschlagsDaten } from '../../domain/Vorschlag.js';
import type { VorschlagRepository } from '../../domain/VorschlagRepository.js';

interface VorschlagModel extends Omit<VorschlagsDaten, 'moeglicherZeitrahmen'> {
    moeglicherZeitrahmenVon: Date;
    moeglicherZeitrahmenBis: Date;
}

class VorschlagModel extends Model {
    static override get tableName() {
        return 'vorschlagswesen.vorschlaege';
    }

    static override get idColumn() {
        return 'id';
    }
}

export const VorschlagRepositoryImpl = withTransactionFor<VorschlagRepository>((trx) => ({
    async add(vorschlag) {
        const { moeglicherZeitrahmen, ...rest } = vorschlag;

        await VorschlagModel.query(trx)
            .insert({
                moeglicherZeitrahmenVon: moeglicherZeitrahmen.von,
                moeglicherZeitrahmenBis: moeglicherZeitrahmen.bis,
                ...rest,
            })
            .debug();
    },

    async getAll() {
        return VorschlagModel.query(trx).then((d) =>
            d.map(({ moeglicherZeitrahmenVon, moeglicherZeitrahmenBis, ...rest }) =>
                createVorschlag({
                    moeglicherZeitrahmen: {
                        von: moeglicherZeitrahmenVon,
                        bis: moeglicherZeitrahmenBis,
                    },
                    ...rest,
                }),
            ),
        );
    },
}));
