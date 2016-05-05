"use strict";

import { Queryable, QueryableInstance, QueryableCollection } from "./Queryable";

/**
 * Describes a collection of site users
 *
 */
export class SiteGroups extends QueryableCollection {

    /**
     * Creates a new instance of the SiteUsers class
     *
     * @param baseUrl The url or Queryable which forms the parent of this user collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "SiteUsers");
    }

    /**
     * Gets a user from the collection by email
     *
     * @param email The email of the user
     * @param expandUsersGroups boolean Whether or not to expand the user's groups.  Default: false
     */
    public getByEmail(email: string, expandUsersGroups = false): Group {
        return new Group(this.toUrl(), `getByEmail('\"${email}\"')`);
    }

    /**
     * Gets a user from the collection by id
     *
     * @param id The id of the user
     */
    public getById(id: number, expandUsersGroups = false) {
        this.get();
    }

    /**
     * Gets a user from the collection by login name
     *
     * @param loginName The email address of the user
     */
    public getByLoginName(loginName: string, expandUsersGroups = false): Group {
        return new Group(this.toUrl(), `getByloginName('${loginName}')`);
    }

    /**
     * Removes a user from the collection by id
     *
     * @param id The id of the user
     */
    public removeById(id: number | Queryable): Promise<any> {
        let url;

        if (true) {
            url = this.toUrl().concat(`removeById('${id}')`);
        } else {
            // url = (id as Queryable).toUrl();
        }
        return this.post();
    }

    /**
     * Removes a user from the collection by login name
     *
     * @param loginName The login name of the user
     */
    public removeByLoginName(loginName: string): Group {
        return new Group(this.toUrl(), `removeByloginName('${loginName}')`);
    }
}


/**
 * Describes a single user
 *
 */
export class Group extends QueryableInstance {
    /**
     * Creates a new instance of the User class
     *
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional, passes the path to the user
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }

    public get allowMembersEditMembership(): string {
        this.append("LoginName");
        return "";
    }

    public set allowMembersEditMembership(value) {
        this.append("LoginName");
    }

    public get id(): number {
        this.append("LoginName");
        return 0;
    }

    public get isHiddenInUI(): boolean {
        this.append("LoginName");
        return true;
    }

    public get isSiteAdmin(): boolean {
        this.append("LoginName");
        return true;
    }

    public set isSiteAdmin(value) {
        this.append("LoginName");
    }

    public get principalType(): PrincipalType {
        this.append("LoginName");
        return PrincipalType.None;
    }

    public get title(): string {
        this.append("LoginName");
        return "";
    }

    public set title(value) {
        this.append("LoginName");
    }

    public get userId(): UserIdInfo {
        this.append("LoginName");
        return {nameId: "" , nameIdIssuer: ""};
    }
}

enum PrincipalType {
    None = 0,
    User = 1,
    DistributionList = 2,
    SecurityGroup = 4,
    SharePointGroup = 8,
    All = 15
}

export interface UserIdInfo {
    nameId: string;
    nameIdIssuer: string;
}
