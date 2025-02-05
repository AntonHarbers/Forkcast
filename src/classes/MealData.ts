import { MealIngredientType } from '../types';

class MealData {
  constructor(
    public uid: string,
    public name: string,
    public ingredients: MealIngredientType[],
    public date: string,
    public order: number,
    public finished: boolean,
    public isDeleted: boolean,
    public deletedAt: string
  ) {
    this.uid = uid;
    this.name = name;
    this.ingredients = ingredients;
    this.date = date;
    this.order = order;
    this.finished = finished;
    this.isDeleted = isDeleted;
    this.deletedAt = deletedAt;
  }
}

export default MealData;

// think about meal presets
