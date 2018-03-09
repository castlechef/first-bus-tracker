export class IdGenerator {
    private currentId: number;

    constructor() {
        this.resetIds();
    }

    public getNextId(): number {
        return this.currentId++;
    }

    public resetIds(): void {
        this.currentId = 0;
    }
}