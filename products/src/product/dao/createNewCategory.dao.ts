import { NewCategory } from "../../../products/db/categories";
import { db } from "../../../authentication/src/db";
import * as schema from '../../../products/db/categories'

export const createNewCategory = async (data: NewCategory) => {
    const result = await db
        .insert(schema.categories)
        .values(data)
        .returning({
            id: schema.categories.id,
            name: schema.categories.name,
        })
    return result?.[0];
}