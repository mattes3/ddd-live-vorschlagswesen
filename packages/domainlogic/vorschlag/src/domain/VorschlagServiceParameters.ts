import { Err, Ok, Result } from 'ts-results-es';
import { z } from 'zod';

import { zodValidationError, type ValidationError } from '@vorschlagswesen/modellierung';

import { FuegeVorschlagHinzuCommand } from './FuegeVorschlagHinzuCommand.js';

const fuegeVorschlagHinzuCommandSchema = z.object({
    aktuellerBenutzer: z.string().nonempty('Die ID des Benutzers muss angegeben sein'),
    titel: z.string().nonempty('Bitte einen Titel angeben'),
    businessVorteil: z.string().nonempty('Bitte den Vorteil für das Business beschreiben'),
    moeglicherUmsetzungsAufwand: z.coerce
        .number()
        .positive('Der Umsetzungsaufwand sollte positiv sein'),
    moeglicherZeitrahmen: z.object({
        von: z.string().transform((str) => new Date(str)),
        bis: z.string().transform((str) => new Date(str)),
    }),
    nichtUmsKonsequenzen: z
        .string()
        .nonempty(
            'Bitte die Konsequenzen für den Fall beschreiben, dass der Vorschlag nicht umgesetzt werden sollte',
        ),
});

export type UnvalidatedFuegeVorschlagHinzuCommand = {
    aktuellerBenutzer: any;
    titel: any;
    businessVorteil: any;
    moeglicherUmsetzungsAufwand: any;
    moeglicherZeitrahmen: { von: any; bis: any };
    nichtUmsKonsequenzen: any;
};

export function parseFuegeVorschlagHinzuCommand(
    params: UnvalidatedFuegeVorschlagHinzuCommand,
): Result<FuegeVorschlagHinzuCommand, ValidationError> {
    console.dir(params);
    const result = fuegeVorschlagHinzuCommandSchema.safeParse(params);
    return result.success
        ? Ok(result.data as FuegeVorschlagHinzuCommand)
        : Err(zodValidationError(result.error));
}
