export class JSONThink {
    stringify(value: any) {
        return JSON.stringify(value);
    }

    parse(text: string) {
        return JSON.parse(text);
    }
}

export const jsonThink = new JSONThink();
