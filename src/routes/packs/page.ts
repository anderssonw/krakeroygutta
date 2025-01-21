enum KrakeroyRarity {
    Common,
    Rare,
    Special
}

enum KrakeroyHolographic {
    Standard,
    Holo,
    Reverse
}


interface KrakeroyStarterPack {
    image: string;
    title: string;
    rarity: KrakeroyRarity;
    holo: KrakeroyHolographic;
}

export const cards: KrakeroyStarterPack[] = 
[

];