import { NewProduct } from "../../../products/db/products";
import { db } from "../../../authentication/src/db";
import * as schema from '../../../products/db/products'

export const createNewProduct = async (data: NewProduct) => {
    const result = await db
                    .insert(schema.products)
                    .values(data)
                    .returning({
                        id: schema.products.id,
                        name: schema.products.name,
                        description: schema.products.description,
                        price: schema.products.price,
                        quantity_available: schema.products.quantity_available,
                    })
    return result?.[0];
}