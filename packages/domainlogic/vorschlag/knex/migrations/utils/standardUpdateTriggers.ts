export function createUpdateTrigger(tableName: string): string {
    return `
        CREATE OR REPLACE FUNCTION vorschlagswesen.trigger_set_${tableName}_updated_at()
        RETURNS TRIGGER AS
        $$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER set_updated_at
            BEFORE UPDATE
            ON vorschlagswesen.${tableName}
            FOR EACH ROW
        EXECUTE PROCEDURE vorschlagswesen.trigger_set_${tableName}_updated_at();
    `;
}

export function dropUpdateTrigger(tableName: string): string {
    return `
        DROP TRIGGER set_updated_at ON vorschlagswesen.${tableName};
        DROP FUNCTION vorschlagswesen.trigger_set_${tableName}_updated_at;
    `;
}
