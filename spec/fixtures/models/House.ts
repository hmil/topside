import Character from './Character';

export default class House {
    constructor(
            public readonly name: string,
            public readonly motto: string,
            public readonly people: Character[]) {
    }

    public getMotto(): string {
        return 'House ' + this.name + ' says: ' + this.motto;
    }

    public toString(): string {
        return this.name;
    }
}
