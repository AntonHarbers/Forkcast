class IngredientBlueprint {
  constructor(
    public uid: string,
    public name: string,
    public storeUid: string,
    public unitId: string,
    public categoryId: string | null
  ) {
    this.uid = uid;
    this.name = name;
    this.storeUid = storeUid;
    this.unitId = unitId;
    this.categoryId = categoryId;
  }
}

export default IngredientBlueprint;
