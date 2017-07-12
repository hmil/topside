

export default class Character {
    constructor(
            public name: string,
            public sex: 'M' | 'F' | null,
            public children?: Character[]) {
    }
}