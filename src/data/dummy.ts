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
      { id: '0', blueprintId: '1', amount: 2 },
      { id: '1', blueprintId: '2', amount: 1 },
    ],
    date: 'Mon Jan 27 2025',
    order: 0,
  },
];

export const UnitData = [
  { id: '0', name: 'KG' },
  { id: '1', name: 'Litres' },
  { id: '2', name: 'Pieces' },
  { id: '3', name: 'Bottles' },
];
