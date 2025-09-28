import { describe, it } from 'node:test';
import { expect } from 'expect';

import {
    FuegeVorschlagHinzuServiceImpl,
    initKnexAndObjection,
    parseFuegeVorschlagHinzuServiceParams,
    VorschlagRepositoryImpl,
} from '../src/index.js';
import type { BenutzerId } from '@vorschlagswesen/dl-benutzer';
import type { Aufwand, ZeitRahmen } from '../src/domainmodel/VorschlagTypes.js';
import { beginWith } from '@vorschlagswesen/modellierung';
import { Err, Ok } from 'ts-results-es';

describe('FuegeVorschlagHinzuService', () => {
    it('sollte die Parameter korrekt validieren', () => {
        // Arrange
        const validParams = {
            einreicherId: 'user-123' as BenutzerId,
            titel: 'Test Vorschlag',
            businessVorteil: 'Mehr Effizienz durch Automatisierung',
            moeglicherUmsetzungsAufwand: 5 as Aufwand,
            moeglicherZeitrahmen: {
                von: new Date('2024-01-01'),
                bis: new Date('2024-12-31'),
            } as ZeitRahmen,
            nichtUmsKonsequenzen: 'Weniger Effizienz ohne Automatisierung',
        };

        // Act
        const result = parseFuegeVorschlagHinzuServiceParams(validParams);

        // Assert
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.titel).toBe('Test Vorschlag');
            expect(result.value.businessVorteil).toBe('Mehr Effizienz durch Automatisierung');
            expect(result.value.nichtUmsKonsequenzen).toBe(
                'Weniger Effizienz ohne Automatisierung',
            );
        }
    });

    it('sollte leeren Titel abweisen', () => {
        // Arrange
        const invalidParams = {
            einreicherId: 'user-123',
            titel: '',
            businessVorteil: 'Mehr Effizienz',
            moeglicherUmsetzungsAufwand: 5,
            moeglicherZeitrahmen: {
                von: new Date('2024-01-01'),
                bis: new Date('2024-12-31'),
            },
            nichtUmsKonsequenzen: 'Weniger Effizienz',
        };

        // Act
        const result = parseFuegeVorschlagHinzuServiceParams(invalidParams);

        // Assert
        expect(result.isErr()).toBe(true);
    });

    it('sollte negativen Aufwand abweisen', () => {
        // Arrange
        const invalidParams = {
            einreicherId: 'user-123',
            titel: 'Test Vorschlag',
            businessVorteil: 'Mehr Effizienz',
            moeglicherUmsetzungsAufwand: -5,
            moeglicherZeitrahmen: {
                von: new Date('2024-01-01'),
                bis: new Date('2024-12-31'),
            },
            nichtUmsKonsequenzen: 'Weniger Effizienz',
        };

        // Act
        const result = parseFuegeVorschlagHinzuServiceParams(invalidParams);

        // Assert
        expect(result.isErr()).toBe(true);
    });

    it('sollte ungültigen Datumsbereich abweisen', () => {
        // Arrange
        const invalidParams = {
            einreicherId: 'user-123',
            titel: 'Test Vorschlag',
            businessVorteil: 'Mehr Effizienz',
            moeglicherUmsetzungsAufwand: 5,
            moeglicherZeitrahmen: {
                von: 'invalid-date',
                bis: 'invalid-date',
            },
            nichtUmsKonsequenzen: 'Weniger Effizienz',
        };

        // Act
        const result = parseFuegeVorschlagHinzuServiceParams(invalidParams);

        // Assert
        expect(result.isErr()).toBe(true);
    });

    it('sollte tatsächlich einen Vorschlag hinzufügen', async () => {
        const testParams = {
            einreicherId: 'user-123' as BenutzerId,
            titel: 'Test Vorschlag',
            businessVorteil: 'Mehr Effizienz durch Automatisierung',
            moeglicherUmsetzungsAufwand: 5 as Aufwand,
            moeglicherZeitrahmen: {
                von: new Date('2024-01-01'),
                bis: new Date('2024-12-31'),
            } as ZeitRahmen,
            nichtUmsKonsequenzen: 'Weniger Effizienz ohne Automatisierung',
        };

        await initKnexAndObjection().andThen(async (knex) => {
            const transactionProvider = VorschlagRepositoryImpl(knex);
            const fuegeVorschlagHinzu = FuegeVorschlagHinzuServiceImpl(transactionProvider);

            const r = await beginWith(testParams)
                .andThen(parseFuegeVorschlagHinzuServiceParams)
                .andThen(fuegeVorschlagHinzu).promise;

            expect(r.isOk()).toBeTruthy();
            return Ok.EMPTY;
        }).promise;
    });
});
