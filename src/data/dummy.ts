import { IngredientBlueprintType } from '../types';

// dummyData.ts
export const IngredientBlueprintDataDB: IngredientBlueprintType[] = [
  { uid: '1', name: 'Tomato', storeUid: '123' },
  { uid: '2', name: 'Cheese', storeUid: '123' },
  { uid: '3', name: 'Onion', storeUid: '123' },
  { uid: '4', name: 'Burger', storeUid: '123' },
  { uid: '5', name: 'Chips', storeUid: '123' },
  { uid: '6', name: 'Banana', storeUid: '123' },
];

export const StoreDataDB = [
  { uid: '1', name: 'Default', location: 'Default' },
  { uid: '2', name: 'ALDI', location: 'CP' },
  { uid: '3', name: 'REWE', location: 'CP' },
  { uid: '4', name: 'GLOBUS', location: '-' },
  { uid: '5', name: 'LIDL', location: '-' },
];

export const dummyMeals = [
  {
    id: '1',
    name: 'Pizza',
    ingredients: [{ id: '2', name: 'Cheese', quantity: 1 }],
  },
];
