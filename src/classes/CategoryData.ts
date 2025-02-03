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

// categories should show up in every store if they belong to that store and have not been deleted
// under the categories we should see a list of the ingredients belonging to that category
// null categories should show up last
// update category button, changes the name
// up and down arrows to change the order
