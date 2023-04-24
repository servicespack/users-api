import { PrimaryKey } from "@mikro-orm/core";

export class RelationalEntity {
    @PrimaryKey()
    id!: string;
}