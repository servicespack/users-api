import { PrimaryKey, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

export class MongoDBEntity {
  @PrimaryKey()
    '_id'!: ObjectId;

  @SerializedPrimaryKey()
    id!: string;
}
