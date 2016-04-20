
import { RoleAssignments } from "./RoleAssignments";
import { Queryable, QueryableInstance } from "./Queryable";

export class QueryableSecurable extends QueryableInstance {

    /**
     * Gets the set of role assignments for this item
     * 
     */
    public get roleAssignments(): RoleAssignments {
        return new RoleAssignments(this);
    }

    /**
     * Gets the closest securable up the security hierarchy whose permissions are applied to this list item
     * 
     */
    public get firstUniqueAncestorSecurableObject(): QueryableInstance {
        this.append("FirstUniqueAncestorSecurableObject");
        return new QueryableInstance(this);
    }

    /**
     * Gets the effective permissions for the user supplied
     * 
     * @param loginName The claims username for the user (ex: i:0#.f|membership|user@domain.com)
     */
    public getUserEffectivePermissions(loginName: string): Queryable {
        this.append("getUserEffectivePermissions(@user)");
        this._query.add("@user", "'" + encodeURIComponent(loginName) + "'");
        return new Queryable(this);
    }

    /**
     * Breaks the security inheritance at this level optinally copying permissions and clearing subscopes
     * 
     * @param copyRoleAssignments If true the permissions are copied from the current parent scope
     * @param clearSubscopes Optional. true to make all child securable objects inherit role assignments from the current object
     */
    public breakRoleInheritance(copyRoleAssignments = false, clearSubscopes = false): Promise<any> {

        class Breaker extends Queryable {
            constructor(baseUrl: string | Queryable, copy: boolean, clear: boolean) {
                super(baseUrl, `breakroleinheritance(copyroleassignments=${copy}, clearsubscopes=${clear})`);
            }

            public break(): Promise<any> {
                return this.post();
            }
        }

        let b = new Breaker(this, copyRoleAssignments, clearSubscopes);
        return b.break();
    }

    /**
     * Breaks the security inheritance at this level optinally copying permissions and clearing subscopes
     * 
     */
    public resetRoleInheritance(): Promise<any> {

        class Resetter extends Queryable {
            constructor(baseUrl: string | Queryable) {
                super(baseUrl, "resetroleinheritance");
            }

            public reset(): Promise<any> {
                return this.post();
            }
        }

        let r = new Resetter(this);
        return r.reset();
    }
}
