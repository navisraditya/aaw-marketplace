import { db } from "../../../authentication/src/db";
import * as schema from '@db/schema/wishlist/wishlistDetail';
import { NewWishlistDetail } from "@db/schema/wishlist/wishlistDetail";

export const addProductToWishlist = async (data: NewWishlistDetail) => {
    const result = await db
                    .insert(schema.wishlistDetail)
                    .values(data)
                    .returning()
    return result?.[0];
}