import {
    type SingleError,
    singleError,
    type TechError,
    type ValidationError,
} from '@vorschlagswesen/modellierung';

export type FuegeVorschlagHinzuServiceError =
    | SingleError<'FuegeVorschlagHinzuServiceError'>
    | TechError
    | ValidationError;

export const createFuegeVorschlagHinzuServiceError = (
    yourErrorInformation: string,
): FuegeVorschlagHinzuServiceError =>
    singleError(
        'FuegeVorschlagHinzuServiceError',
        `FuegeVorschlagHinzuService failed: ${yourErrorInformation}`,
    );
