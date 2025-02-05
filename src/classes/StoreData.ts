class StoreData {
  constructor(
    public uid: string,
    public name: string,
    public location: string,
    public isDeleted: boolean,
    public deletedAt: string
  ) {
    this.uid = uid;
    this.name = name;
    this.location = location;
    this.isDeleted = isDeleted;
    this.deletedAt = deletedAt;
  }
}

export default StoreData;
