export abstract class BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;

  constructor(baseEntity: BaseEntity) {
    this.id = baseEntity.id;
    this.createdAt = baseEntity.createdAt;
    this.updatedAt = baseEntity.updatedAt;
  }
}
