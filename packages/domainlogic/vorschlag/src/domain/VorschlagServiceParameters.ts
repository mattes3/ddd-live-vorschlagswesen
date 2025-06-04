import { Err, Ok, Result } from 'ts-results-es';
import { z } from 'zod';

import { zodValidationError, type ValidationError } from '@vorschlagswesen/modellierung';

import { FuegeVorschlagHinzuCommand } from './FuegeVorschlagHinzuCommand.js';

const fuegeVorschlagHinzuCommandSchema = z.object({
    aktuellerBenutzer: z.string(),
    titel: z.string().nonempty(),
    businessVorteil: z.string().nonempty(),
    moeglicherUmsetzungsAufwand: z.number().positive(),
    moeglicherZeitrahmen: z.object({
        von: z.string().transform((str) => new Date(str)),
        bis: z.string().transform((str) => new Date(str)),
    }),
    nichtUmsKonsequenzen: z.string().nonempty(),
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
    const result = fuegeVorschlagHinzuCommandSchema.safeParse(params);
    return result.success
        ? Ok(result.data as FuegeVorschlagHinzuCommand)
        : Err(zodValidationError(result.error));
}
