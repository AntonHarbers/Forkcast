import Category from '../classes/CategoryData';
import Unit from '../classes/UnitData';
import { IngredientBlueprintType, MealDataType } from '../types';

// dummyData.ts
export const IngredientBlueprintDataDB: IngredientBlueprintType[] = [
  {
    uid: '1',
    name: 'Tomato',
    storeUid: '2',
    unitId: '0',
    categoryId: null,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    uid: '2',
    name: 'Cheese',
    storeUid: '2',
    unitId: '0',
    categoryId: null,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    uid: '3',
    name: 'Onion',
    storeUid: '2',
    unitId: '0',
    categoryId: '3',
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    uid: '4',
    name: 'Burger',
    storeUid: '2',
    unitId: '0',
    categoryId: null,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    uid: '5',
    name: 'Chips',
    storeUid: '3',
    unitId: '0',
    categoryId: null,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    uid: '6',
    name: 'Banana',
    storeUid: '3',
    unitId: '0',
    categoryId: null,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
];

export const StoreDataDB = [
  { uid: '1', name: 'Default', location: 'Default' },
  { uid: '2', name: 'ALDI', location: 'CP' },
  { uid: '3', name: 'REWE', location: 'CP' },
  { uid: '4', name: 'GLOBUS', location: '-' },
  { uid: '5', name: 'LIDL', location: '-' },
];

export const CategoryDummyData: Category[] = [
  {
    id: '1',
    name: 'Veggies',
    order: 0,
    storeId: '2',
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '2',
    name: 'Fruits',
    order: 1,
    storeId: '2',
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '3',
    name: 'Mock Meat',
    order: 2,
    storeId: '2',
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '4',
    name: 'Drinks',
    order: 3,
    storeId: '3',
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
];

export const dummyMeals: MealDataType[] = [
  {
    id: '1',
    name: 'Pizza',
    ingredients: [
      { id: '0', blueprintId: '1', amount: 2, bought: false },
      { id: '1', blueprintId: '2', amount: 1, bought: false },
    ],
    date: new Date().toDateString(),
    order: 0,
    finished: false,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '2',
    name: 'Burgers',
    ingredients: [
      { id: '4', blueprintId: '3', amount: 2, bought: false },
      { id: '3', blueprintId: '2', amount: 2, bought: false },
    ],
    date: new Date().toDateString(),
    order: 4,
    finished: true,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '3',
    name: 'English Breakfast',
    ingredients: [
      { id: '5', blueprintId: '4', amount: 2, bought: false },
      { id: '6', blueprintId: '6', amount: 4, bought: false },
      { id: '7', blueprintId: '2', amount: 5, bought: true },
    ],
    date: new Date().toDateString(),
    order: 3,
    finished: false,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '4',
    name: 'Pizza',
    ingredients: [
      { id: '8', blueprintId: '1', amount: 2, bought: false },
      { id: '9', blueprintId: '2', amount: 1, bought: true },
    ],
    date: new Date().toDateString(),
    order: 2,
    finished: false,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
];

export const UnitData: Unit[] = [
  {
    id: '0',
    name: 'KG',
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '1',
    name: 'Litres',
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '2',
    name: 'Pieces',
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '3',
    name: 'Bottles',
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
];
