import { Err, Ok, type Result } from 'ts-results-es';
import z from 'zod';

import { type Branded } from '@vorschlagswesen/modellierung';
import { zodValidationError } from '@vorschlagswesen/modellierung';
import type { BenutzerId } from '@vorschlagswesen/dl-benutzer';

// Using .js extensions for ESM compliance with TypeScript's nodenext moduleResolution
import { type FuegeVorschlagHinzuServiceError } from './FuegeVorschlagHinzuServiceErrors.js';
import type { Aufwand, ZeitRahmen } from './VorschlagTypes.js';

const FuegeVorschlagHinzuServiceSchema = z.object({
    einreicherId: z.string(),
    titel: z.string().nonempty('Bitte einen Titel angeben'),
    businessVorteil: z.string().nonempty('Bitte den Vorteil für das Business beschreiben'),
    moeglicherUmsetzungsAufwand: z.coerce
        .number()
        .positive('Der Umsetzungsaufwand sollte positiv sein'),
    moeglicherZeitrahmen: z.object({
        von: z.coerce.date(),
        bis: z.coerce.date(),
    }),
    nichtUmsKonsequenzen: z
        .string()
        .nonempty(
            'Bitte die Konsequenzen für den Fall beschreiben, dass der Vorschlag nicht umgesetzt werden sollte',
        ),
});

export type FuegeVorschlagHinzuServiceParams = Branded<
    Omit<
        z.infer<typeof FuegeVorschlagHinzuServiceSchema>,
        'einreicherId' | 'moeglicherUmsetzungsAufwand' | 'moeglicherZeitrahmen'
    > & {
        einreicherId: BenutzerId;
        moeglicherUmsetzungsAufwand: Aufwand;
        moeglicherZeitrahmen: ZeitRahmen;
    },
    'validated'
>;

export function parseFuegeVorschlagHinzuServiceParams(params: {
    einreicherId: any;
    titel: any;
    businessVorteil: any;
    moeglicherUmsetzungsAufwand: any;
    moeglicherZeitrahmen: any;
    nichtUmsKonsequenzen: any;
}): Result<FuegeVorschlagHinzuServiceParams, FuegeVorschlagHinzuServiceError> {
    const result = FuegeVorschlagHinzuServiceSchema.safeParse(params);
    return result.success
        ? Ok(result.data as FuegeVorschlagHinzuServiceParams)
        : Err(zodValidationError(result.error));
}
