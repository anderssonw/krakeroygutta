enum KrakeroyRarity {
    Common,
    Rare,
    Special
}

export enum KrakeroyHolographic {
    Standard,
    Holo,
}

export interface KrakeroyStarterPack {
    image: string;
    title: string;
    rarity: KrakeroyRarity;
    holo: KrakeroyHolographic;
}

export const cards: KrakeroyStarterPack[] = 
[
    {
        image: 'https://i.imgur.com/a2pz2lk.png',
        title: 'Ryggsvette',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    },
    {
        image: 'https://i.imgur.com/sYSw5hq.png',
        title: 'Breakdance',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Holo
    },
    {
        image: 'https://i.imgur.com/jUS920B.png',
        title: 'Baris',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Holo
    },
    {
        image: 'https://i.imgur.com/RKnWBDw.png',
        title: 'CPAP',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    },
    {
        image: 'https://i.imgur.com/LNtnuV6.png',
        title: 'Rike foreldre',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    },
    {
        image: 'https://i.imgur.com/4Y9bMti.png',
        title: 'Fotball',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    },
    {
        image: 'https://i.imgur.com/bNc2O1Z.png',
        title: 'Sumpa',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    },
    {
        image: 'https://i.imgur.com/a1oy64S.png',
        title: 'Sykehus i Madagaskar',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    },
    {
        image: 'https://i.imgur.com/mstSiDj.png',
        title: 'Ødelagte tær',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    },
    {
        image: 'https://i.imgur.com/s7npr6g.png',
        title: 'Ølmage',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    },
    {
        image: 'https://i.imgur.com/Ibg9Yvz.png',
        title: 'Jokeren',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    },
    {
        image: 'https://i.imgur.com/dILJhC0.png',
        title: 'Fyllegitar',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    },
    {
        image: 'https://i.imgur.com/dH6x2kG.png',
        title: 'Tinder',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    },
    {
        image: 'https://i.imgur.com/9gWjvcq.png',
        title: 'Dårlig Batman imitasjon',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    },
    {
        image: 'https://i.imgur.com/5wrcjsN.png',
        title: 'Canada',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Holo
    },
    {
        image: 'https://i.imgur.com/zx5nfwF.png',
        title: 'Kyllingbaguette',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    },  {
        image: 'https://i.imgur.com/RR24kRw.png',
        title: 'Nachbil',
        rarity: KrakeroyRarity.Common,
        holo: KrakeroyHolographic.Standard
    }
];