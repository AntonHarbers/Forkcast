class IngredientBlueprint {
  constructor(
    public uid: string,
    public name: string,
    public storeUid: string,
    public unitId: string
  ) {
    this.uid = uid;
    this.name = name;
    this.storeUid = storeUid;
    this.unitId = unitId;
  }
}

export default IngredientBlueprint;
