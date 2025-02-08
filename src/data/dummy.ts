import {
  CategoryInterface,
  IngredientBlueprintInterface,
  MealInterface,
  StoreInterface,
  UnitInterface,
} from '../ts/interfaces';

export const IngredientBlueprintDataDB: IngredientBlueprintInterface[] = [
  {
    id: '1',
    name: 'Tomato',
    storeUid: '2',
    unitId: '0',
    categoryId: null,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '2',
    name: 'Cheese',
    storeUid: '2',
    unitId: '0',
    categoryId: null,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '3',
    name: 'Onion',
    storeUid: '2',
    unitId: '0',
    categoryId: '3',
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '4',
    name: 'Burger',
    storeUid: '2',
    unitId: '0',
    categoryId: null,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '5',
    name: 'Chips',
    storeUid: '3',
    unitId: '0',
    categoryId: null,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
  {
    id: '6',
    name: 'Banana',
    storeUid: '3',
    unitId: '0',
    categoryId: null,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
];

export const StoreDataDB: StoreInterface[] = [
  {
    id: '1',
    name: 'Default',
    location: 'Default',
    deletedAt: new Date().toDateString(),
    isDeleted: false,
  },
  {
    id: '2',
    name: 'ALDI',
    location: 'CP',
    deletedAt: new Date().toDateString(),
    isDeleted: false,
  },
  {
    id: '3',
    name: 'REWE',
    location: 'CP',
    deletedAt: new Date().toDateString(),
    isDeleted: false,
  },
  {
    id: '4',
    name: 'GLOBUS',
    location: '-',
    deletedAt: new Date().toDateString(),
    isDeleted: false,
  },
  {
    id: '5',
    name: 'LIDL',
    location: '-',
    deletedAt: new Date().toDateString(),
    isDeleted: false,
  },
];

export const CategoryDummyData: CategoryInterface[] = [
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

export const dummyMeals: MealInterface[] = [
  {
    id: '1',
    name: 'Pizza',
    ingredients: [
      { id: '0', blueprintId: '1', amount: 2, bought: false },
      { id: '1', blueprintId: '2', amount: 1, bought: false },
    ],
    date: new Date().toDateString(),
    order: 0,
    isFinished: false,
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
    isFinished: true,
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
    isFinished: false,
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
    isFinished: false,
    isDeleted: false,
    deletedAt: new Date().toDateString(),
  },
];

export const UnitData: UnitInterface[] = [
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
