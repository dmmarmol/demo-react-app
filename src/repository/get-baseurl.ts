export function getBaseUrl(): string {
    const hostname = process.env.HOSTNAME || 'localhost';
    const port = process.env.PORT || '13000';
    
    return `http://${hostname}:${port}`;
}