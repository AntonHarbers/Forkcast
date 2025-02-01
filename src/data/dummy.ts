import { IngredientBlueprintType, MealDataType } from '../types';

// dummyData.ts
export const IngredientBlueprintDataDB: IngredientBlueprintType[] = [
  { uid: '1', name: 'Tomato', storeUid: '1', unitId: '0' },
  { uid: '2', name: 'Cheese', storeUid: '1', unitId: '0' },
  { uid: '3', name: 'Onion', storeUid: '2', unitId: '0' },
  { uid: '4', name: 'Burger', storeUid: '2', unitId: '0' },
  { uid: '5', name: 'Chips', storeUid: '3', unitId: '0' },
  { uid: '6', name: 'Banana', storeUid: '3', unitId: '0' },
];

export const StoreDataDB = [
  { uid: '1', name: 'Default', location: 'Default' },
  { uid: '2', name: 'ALDI', location: 'CP' },
  { uid: '3', name: 'REWE', location: 'CP' },
  { uid: '4', name: 'GLOBUS', location: '-' },
  { uid: '5', name: 'LIDL', location: '-' },
];

export const dummyMeals: MealDataType[] = [
  {
    id: '1',
    name: 'Pizza',
    ingredients: [
      { id: '0', blueprintId: '1', amount: 2, bought: false },
      { id: '1', blueprintId: '2', amount: 1, bought: false },
    ],
    date: 'Thu Jan 30 2025',
    order: 0,
    finished: false,
  },
  {
    id: '2',
    name: 'Burgers',
    ingredients: [
      { id: '4', blueprintId: '3', amount: 2, bought: false },
      { id: '3', blueprintId: '2', amount: 2, bought: false },
    ],
    date: 'Thu Jan 30 2025',
    order: 1,
    finished: true,
  },
  {
    id: '3',
    name: 'English Breakfast',
    ingredients: [
      { id: '5', blueprintId: '4', amount: 2, bought: false },
      { id: '6', blueprintId: '6', amount: 4, bought: false },
      { id: '7', blueprintId: '2', amount: 5, bought: true },
    ],
    date: 'Sat Feb 01 2025',
    order: 1,
    finished: false,
  },
  {
    id: '4',
    name: 'Pizza',
    ingredients: [
      { id: '8', blueprintId: '1', amount: 2, bought: false },
      { id: '9', blueprintId: '2', amount: 1, bought: true },
    ],
    date: 'Sat Feb 01 2025',
    order: 0,
    finished: false,
  },
];

export const UnitData = [
  { id: '0', name: 'KG' },
  { id: '1', name: 'Litres' },
  { id: '2', name: 'Pieces' },
  { id: '3', name: 'Bottles' },
];
