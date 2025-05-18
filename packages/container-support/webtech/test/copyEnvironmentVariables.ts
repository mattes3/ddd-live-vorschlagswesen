export function copyEnvironmentVariables() {
    process.env['POSTGRES_HOSTNAME'] = process.env['POSTGRES_DEV_HOSTNAME'];
    process.env['POSTGRES_PORT'] = process.env['POSTGRES_DEV_PORT'];
    process.env['POSTGRES_USER'] = process.env['POSTGRES_DEV_USER'];
    process.env['POSTGRES_PASSWORD'] = process.env['POSTGRES_DEV_PASSWORD'];
    process.env['POSTGRES_DB'] = process.env['POSTGRES_DEV_DB'];
    process.env['POSTGRES_SSL'] = process.env['POSTGRES_DEV_SSL'];
}
