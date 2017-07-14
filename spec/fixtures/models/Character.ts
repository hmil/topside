

export default class Character {
    constructor(
            public name: string,
            public gender: 'M' | 'F' | null,
            public children?: Character[]) {
    }
}
