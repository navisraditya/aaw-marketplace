import { InternalServerErrorResponse } from "@src/shared/commons/patterns"
import { getAllProductsByTenantId } from "../dao/getAllProductsByTenantId.dao";

export const getAllProductsService = async () => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server Tenant ID not found').generate()
        }

        const products = await getAllProductsByTenantId(SERVER_TENANT_ID);

        return {
            data: {
                products
            },
            status: 200
        }
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}