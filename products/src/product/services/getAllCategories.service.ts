import { InternalServerErrorResponse } from "@src/shared/commons/patterns"
import { getAllCategoriesByTenantId } from "../dao/getAllCategoriesByTenantId.dao";

export const getAllCategoriesService = async () => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server Tenant ID not found').generate()
        }

        const categories = await getAllCategoriesByTenantId(SERVER_TENANT_ID);

        return {
            data: {
                categories
            },
            status: 200
        }
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}