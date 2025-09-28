import { Err, Ok, type Result } from 'ts-results-es';
import z from 'zod';

import { type Branded } from '@vorschlagswesen/modellierung';
import { zodValidationError } from '@vorschlagswesen/modellierung';

// Using .js extensions for ESM compliance with TypeScript's nodenext moduleResolution
import { type GenehmigeVorschlagServiceError } from './GenehmigeVorschlagServiceErrors.js';
import { VorschlagId } from './Vorschlag.js';

const GenehmigeVorschlagServiceSchema = z.object({
    vorschlagId: z.string(),
});

export type GenehmigeVorschlagServiceParams = Branded<
    Omit<z.infer<typeof GenehmigeVorschlagServiceSchema>, 'vorschlagId'> & {
        vorschlagId: VorschlagId;
    },
    'validated'
>;

export function parseGenehmigeVorschlagServiceParams(params: {
    vorschlagId: any;
}): Result<GenehmigeVorschlagServiceParams, GenehmigeVorschlagServiceError> {
    const result = GenehmigeVorschlagServiceSchema.safeParse(params);
    return result.success
        ? Ok(result.data as GenehmigeVorschlagServiceParams)
        : Err(zodValidationError(result.error));
}
