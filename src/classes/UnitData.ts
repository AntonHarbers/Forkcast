export default class Unit {
  constructor(
    public id: string,
    public name: string,
    public isDeleted: boolean,
    public deletedAt: string
  ) {
    this.id = id;
    this.name = name;
    this.isDeleted = isDeleted;
    this.deletedAt = deletedAt;
  }
}
