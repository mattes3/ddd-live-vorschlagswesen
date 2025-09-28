import { describe, it } from 'node:test';
import { expect } from 'expect';

describe('VorschlagRepository', () => {
    it('method findVorschlaegeByZustand', async () => {
        // test the method findVorschlaegeByZustand(zustand: VorschlagsZustand): AsyncResult<Vorschlag[], TechError>
    });

    it('method add', async () => {
        // test the method add(item: VorschlagData): AsyncResult<void, TechError>
    });

    it('method get', async () => {
        // test the method get(id: Vorschlag['id']): AsyncResult<Option<Vorschlag>, TechError>
    });

    it('method update', async () => {
        // test the method update(id: Vorschlag['id'], updates: Partial<Omit<VorschlagData, 'id'>>): AsyncResult<void, TechError>
    });

    it('method remove', async () => {
        // test the method remove(item: VorschlagData): AsyncResult<void, TechError>
    });
});
