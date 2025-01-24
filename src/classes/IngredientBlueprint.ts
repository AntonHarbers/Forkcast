class IngredientBlueprint {
  constructor(
    public uid: string,
    public name: string,
    public storeUid: string
  ) {
    this.uid = uid;
    this.name = name;
    this.storeUid = storeUid;
  }
}

export default IngredientBlueprint;
