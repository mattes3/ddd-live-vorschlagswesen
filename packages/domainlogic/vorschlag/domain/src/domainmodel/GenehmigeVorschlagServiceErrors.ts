import {
    type SingleError,
    singleError,
    type TechError,
    type ValidationError,
} from '@vorschlagswesen/modellierung';

export type GenehmigeVorschlagServiceError =
    | SingleError<'GenehmigeVorschlagServiceError'>
    | TechError
    | ValidationError;

export const createGenehmigeVorschlagServiceError = (
    yourErrorInformation: string,
): GenehmigeVorschlagServiceError =>
    singleError(
        'GenehmigeVorschlagServiceError',
        `GenehmigeVorschlagService failed: ${yourErrorInformation}`,
    );
