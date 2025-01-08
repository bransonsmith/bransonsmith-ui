

export const LEVELS = [
    { "Level": 1,  "SB": 10  , "BB": 20   , "Ante": 0, "StartSeconds": 0,     "Rebuys": 0, "AddOns": 0, "RebuyAllowed": true },
    { "Level": 2,  "SB": 20  , "BB": 40   , "Ante": 0, "StartSeconds": 1200,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": true },
    { "Level": 3,  "SB": 30  , "BB": 60   , "Ante": 0, "StartSeconds": 2400,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": true },
    { "Level": 4,  "SB": 40  , "BB": 80   , "Ante": 0, "StartSeconds": 3600,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": true },
    { "Level": 0,  "SB": '5 MIN BREAK', "BB": '', "Ante": 0, "StartSeconds": 4800,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": true },
    { "Level": 5,  "SB": 50  , "BB": 100  , "Ante": 0, "StartSeconds": 5100,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
    { "Level": 6,  "SB": 70 ,  "BB": 140  , "Ante": 0, "StartSeconds": 6300,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
    { "Level": 7,  "SB": 100 , "BB": 200  , "Ante": 0, "StartSeconds": 7500,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false, "removeChip": 'White' },
    { "Level": 8,  "SB": 150 , "BB": 300  , "Ante": 0, "StartSeconds": 8700,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
    { "Level": 0,  "SB": '5 MIN BREAK', "BB": '', "Ante": 0, "StartSeconds": 9900,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false, "removeChip": 'Red' },
    { "Level": 9,  "SB": 250 , "BB": 500  , "Ante": 0, "StartSeconds": 10200,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
    { "Level": 10, "SB": 350 , "BB": 700 , "Ante": 0, "StartSeconds": 11400, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
    { "Level": 11, "SB": 500 , "BB": 1000 , "Ante": 0, "StartSeconds": 12600, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
    { "Level": 12, "SB": 750,  "BB": 1500 , "Ante": 0, "StartSeconds": 13800, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
    { "Level": 13, "SB": 1000, "BB": 2000 , "Ante": 0, "StartSeconds": 15000, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false, "removeChip": 'Green' },
    { "Level": 14, "SB": 2000, "BB": 4000 , "Ante": 0, "StartSeconds": 16200, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
    { "Level": 15, "SB": 3000, "BB": 6000 , "Ante": 0, "StartSeconds": 17400, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
    { "Level": 16, "SB": 5000, "BB": 10000, "Ante": 0, "StartSeconds": 19800, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
]

export const getLevels = async () => {
    return LEVELS;
}
