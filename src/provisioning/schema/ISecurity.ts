import { IRoleAssignment } from "./iroleassignment";

export interface ISecurity {
    BreakRoleInheritance: boolean;
    CopyRoleAssignments: boolean;
    ClearSubscopes: boolean;
    RoleAssignments: Array<IRoleAssignment>;
}
