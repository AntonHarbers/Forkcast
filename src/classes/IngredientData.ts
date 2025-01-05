class IngredientData {
    constructor (public uid :string, public name :string, public purchased :boolean, public deleted :boolean) {
        this.uid = uid
        this.name = name
        this.purchased = purchased
        this.deleted = deleted
    }
}

export default IngredientData