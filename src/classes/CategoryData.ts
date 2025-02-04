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
