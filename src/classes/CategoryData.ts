export default class Category {
  constructor(
    public id: string,
    public name: string,
    public order: number,
    public storeId: string,
    public isDeleted: boolean,
    public deletedAt: string
  ) {
    this.id = id;
    this.name = name;
    this.order = order;
    this.storeId = storeId;
    this.isDeleted = isDeleted;
    this.deletedAt = deletedAt;
  }
}

// when selecting a different shop with no categories it should set the data back to null
// if selecting a different shop with categories it should set the data to the first one
// categories should be tied to shops
// create new categories in shop edit tab
// categories should show up in every store if they belong to that store and have not been deleted
// null categories should show up last
// under the categories we should see a list of the ingredients belonging to that category
// in the shopping list view, when opening the shop tab, there should be a form for new categories
    // form needs a name, the order will be handled just like the mealOrder, storeId is always set to currentSelectedShop
// delete category button (sets isDeleted and deletedAt fields)
// update category button, changes the name
// up and down arrows to change the order
