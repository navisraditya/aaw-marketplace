// import { Request, Response, NextFunction } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { UnauthenticatedResponse } from "../commons/patterns/exceptions";
// import { verifyAdminTokenService } from "../../../authentication/src/user/services/verifyAdminToken.service";
// import { getTenantService } from "../../../tenant/src/tenant/services/getTenant.service";

// export const verifyJWTProduct = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.headers.authorization?.split("Bearer ")[1];
//     if (!token) {
//       return res.status(401).send({ message: "Invalid token" });
//     }

//     const payload = await verifyAdminTokenService(token);
//     if (payload.status !== 200) {
//       return res.status(401).send({ message: "Invalid token" });
//     }

//     const verifiedPayload = payload as {
//       status: 200;
//       data: {
//         user: {
//           id: string | null;
//           username: string;
//           email: string;
//           full_name: string | null;
//           address: string | null;
//           phone_number: string | null;
//         };
//       };
//     }

//     const SERVER_TENANT_ID = process.env.TENANT_ID;
//     if (!SERVER_TENANT_ID) {
//       return res.status(500).send({ message: "Server Tenant ID not found" });
//     }
//     const tenantPayload = await getTenantService(SERVER_TENANT_ID);

//     if (
//       tenantPayload.status !== 200 ||
//       !tenantPayload.data
//     ) {
//       return res.status(500).send({ message: "Server Tenant not found" });
//     }

//     const verifiedTenantPayload = tenantPayload as {
//       status: 200;
//       data: {
//         tenants: {
//           id: string;
//           owner_id: string;
//         };
//         tenantDetails: {
//           id: string;
//           tenant_id: string;
//           name: string;
//         };
//       };
//     };

//     // Check for tenant ownership
//     if (verifiedPayload.data.user.id !== verifiedTenantPayload.data.tenants.owner_id) {
//       return res.status(401).send({ message: "Invalid token" });
//     }

//     req.body.user = verifiedPayload.data.user;
//     next();
//   } catch (error) {
//     return res.status(401).json(
//       new UnauthenticatedResponse("Invalid token").generate()
//     );
//   }
// };
