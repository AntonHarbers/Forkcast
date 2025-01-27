import { MealIngredientType } from '../types';

class MealData {
  constructor(
    public uid: string,
    public name: string,
    public ingredients: MealIngredientType[],
    public date: string,
    public order: number
  ) //public preset: boolean
  {
    this.uid = uid;
    this.name = name;
    this.ingredients = ingredients;
    this.date = date;
    this.order = order;
    //this.preset = preset;
  }
}

export default MealData;
