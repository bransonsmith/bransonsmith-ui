

export const CHIPS = [
    { 'name': 'White',  'color': '#e6e7e8', 'detail': '#0e1930', 'text': '#ffffff', 'value': 10    , numValue: 10    , 'quantity': 20 },
    { 'name': 'Red',    'color': '#6e091a', 'detail': '#d1cfcf', 'text': '#e6e7e8', 'value': 50    , numValue: 50    , 'quantity': 16 },
    { 'name': 'Black',  'color': '#080707', 'detail': '#d1cfcf', 'text': '#d1cfcf', 'value': 100   , numValue: 100   , 'quantity': 10 },
    { 'name': 'Green',  'color': '#336135', 'detail': '#d1cfcf', 'text': '#e6e7e8', 'value': 250   , numValue: 250   , 'quantity': 4  },
    { 'name': 'Blue',   'color': '#1a348a', 'detail': '#d1cfcf', 'text': '#e6e7e8', 'value': '1K'  , numValue: 1000  , 'quantity': 1  },
    { 'name': 'Pink',   'color': '#a883a3', 'detail': '#ffffff', 'text': '#ffffff', 'value': '2.5K', numValue: 2500  , 'quantity': 0  },
    { 'name': 'Yellow', 'color': '#e8dc72', 'detail': '#ffffff', 'text': '#ffffff', 'value': '5K'  , numValue: 5000  , 'quantity': 0  },
    { 'name': 'Brown',  'color': '#785e4e', 'detail': '#0d0b0a', 'text': '#ffffff', 'value': '10K' , numValue: 10000 , 'quantity': 0  },
]

export const getChips = async () => {
    return CHIPS;
}