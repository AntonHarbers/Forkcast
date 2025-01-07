class MealData {
  constructor(
    public uid: string,
    public name: string,
    public date: string,
    public order: number,
    public preset: boolean
  ) {
    this.uid = uid;
    this.name = name;
    // Ingredients
    this.date = date;
    this.order = order;
    this.preset = preset;
  }
}

export default MealData;
