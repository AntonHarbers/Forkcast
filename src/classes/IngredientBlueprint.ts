class IngredientBlueprint {
  constructor(
    public uid: string,
    public name: string,
    public storeUid: string,
    public unitId: string,
    public categoryId: string | null,
    public isDeleted: boolean,
    public deletedAt: string
  ) {
    this.uid = uid;
    this.name = name;
    this.storeUid = storeUid;
    this.unitId = unitId;
    this.categoryId = categoryId;
    this.isDeleted = isDeleted;
    this.deletedAt = deletedAt;
  }
}

export default IngredientBlueprint;
