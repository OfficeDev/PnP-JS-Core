"use strict";

import { Queryable, QueryableInstance, QueryableCollection } from "./Queryable";
import * as Types from "./types";
import * as FileUtil from "../../utils/files";

export class UserProfileQuery extends QueryableInstance {

    constructor(baseUrl: string | Queryable, path = "sp.userprofiles.peoplemanager") {
        super(baseUrl, path);

        this.profileLoader = new ProfileLoader(baseUrl);
    }

    private profileLoader: ProfileLoader;

    /**
     * The URL of the edit profile page for the current user.
     */
    public get editProfileLink(): Promise<string> {
        let q = new UserProfileQuery(this, "EditProfileLink");
        return q.get();
    }

    /**
     * A Boolean value that indicates whether the current user's People I'm Following list is public.
     */
    public get isMyPeopleListPublic(): Promise<boolean> {
        let q = new UserProfileQuery(this, "IsMyPeopleListPublic");
        return q.get();
    }

    /**
     * A Boolean value that indicates whether the current user's People I'm Following list is public.
     * 
     * @param loginName The account name of the user
     */
    public amIFollowedBy(loginName: string): Promise<boolean> {
        let q = new UserProfileQuery(this, "amifollowedby(@v)");
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.get();
    }

    /**
     * Checks whether the current user is following the specified user.
     * 
     * @param loginName The account name of the user
     */
    public amIFollowing(loginName: string): Promise<boolean> {
        let q = new UserProfileQuery(this, "amifollowing(@v)");
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.get();
    }

    /**
     * Gets tags that the user is following.
     * 
     * @param maxCount The maximum number of tags to get.
     */
    public getFollowedTags(maxCount = 20): Promise<string[]> {
        let q = new UserProfileQuery(this, "getfollowedtags(" + maxCount + ")");
        return q.get();
    }

    /**
     * Gets the people who are following the specified user.
     * 
     * @param loginName The account name of the user.
     */
    public getFollowersFor(loginName: string): Promise<any[]> {
        let q = new UserProfileQuery(this, "getfollowersfor(@v)");
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.get();
    }

    /**
     * Gets the people who are following the current user.
     * 
     */
    public get myFollowers(): QueryableCollection {
        return new QueryableCollection(this, "getmyfollowers");
    }

    /**
     * Gets user properties for the current user.
     * 
     */
    public get myProperties(): QueryableInstance {
        return new UserProfileQuery(this, "getmyproperties");
    }

    /**
     * Gets the people who the specified user is following.
     * 
     * @param loginName The account name of the user.
     */
    public getPeopleFollowedBy(loginName: string): Promise<any[]> {
        let q = new UserProfileQuery(this, "getpeoplefollowedby(@v)");
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.get();
    }

    /**
     * Gets user properties for the specified user.
     * 
     * @param loginName The account name of the user.
     */
    public getPropertiesFor(loginName: string): Promise<any[]> {
        let q = new UserProfileQuery(this, "getpropertiesfor(@v)");
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.get();
    }

    /**
     * Gets the most popular tags.
     * 
     */
    public get trendingTags(): Promise<Types.HashTagCollection> {
        let q = new UserProfileQuery(this, null);
        q.concat(".gettrendingtags");
        return q.get();
    }

    /**
     * Gets the specified user profile property for the specified user.
     * 
     * @param loginName The account name of the user.
     * @param propertyName The case-sensitive name of the property to get.
     */
    public getUserProfilePropertyFor(loginName: string, propertyName: string): Promise<string> {
        let q = new UserProfileQuery(this, `getuserprofilepropertyfor(accountname=@v, propertyname='${propertyName}')`);
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.get();
    }

    /**
     * Removes the specified user from the user's list of suggested people to follow.
     * 
     * @param loginName The account name of the user.
     */
    public hideSuggestion(loginName: string): Promise<void> {
        let q = new UserProfileQuery(this, "hidesuggestion(@v)");
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.post();
    }

    /**
     * Checks whether the first user is following the second user.
     * 
     * @param follower The account name of the user who might be following followee.
     * @param followee The account name of the user who might be followed.
     */
    public isFollowing(follower: string, followee: string): Promise<boolean> {
        let q = new UserProfileQuery(this, null);
        q.concat(`.isfollowing(possiblefolloweraccountname=@v, possiblefolloweeaccountname=@y)`);
        q.query.add("@v", "'" + encodeURIComponent(follower) + "'");
        q.query.add("@y", "'" + encodeURIComponent(followee) + "'");
        return q.get();
    }

    /**
     * Uploads and sets the user profile picture
     * 
     * @param profilePicSource Blob data representing the user's picture
     */
    public setMyProfilePic(profilePicSource: Blob): Promise<void> {
        return FileUtil.readBlobAsArrayBuffer(profilePicSource).then((buffer) => {
            let request = new UserProfileQuery(this, "setmyprofilepicture");
            return request.post({
                body: buffer,
            });
        });
    }

    /**
     * Provisions one or more users' personal sites. (My Site administrator on SharePoint Online only)
     * 
     * @param emails The email addresses of the users to provision sites for
     */
    public createPersonalSiteEnqueueBulk(...emails: string[]): Promise<void> {
        return this.profileLoader.createPersonalSiteEnqueueBulk(emails);
    }

    /**
     * Gets the user profile of the site owner.
     * 
     */
    public get ownerUserProfile(): Promise<Types.UserProfile> {
        return this.profileLoader.ownerUserProfile;
    }

    /**
     * Gets the user profile that corresponds to the current user.
     */
    public get userProfile(): Promise<any> {
        return this.profileLoader.userProfile;
    }

    /**
     * Enqueues creating a personal site for this user, which can be used to share documents, web pages, and other files.
     * 
     * @param interactiveRequest true if interactively (web) initiated request, or false if non-interactively (client) initiated request
     */
    public createPersonalSite(interactiveRequest = false): Promise<void> {
        return this.profileLoader.createPersonalSite(interactiveRequest);
    }

    /**
     * Sets the privacy settings for this profile.
     * 
     * @param share true to make all social data public; false to make all social data private.
     */
    public shareAllSocialData(share): Promise<void> {
        return this.profileLoader.shareAllSocialData(share);
    }
}

class ProfileLoader extends Queryable {

    constructor(baseUrl: string | Queryable, path = "sp.userprofiles.profileloader.getprofileloader") {
        super(baseUrl, path);
    }

    /**
     * Provisions one or more users' personal sites. (My Site administrator on SharePoint Online only)
     * 
     * @param emails The email addresses of the users to provision sites for
     */
    public createPersonalSiteEnqueueBulk(emails: string[]): Promise<void> {
        let q = new ProfileLoader(this, "createpersonalsiteenqueuebulk");
        let postBody = JSON.stringify({ "emailIDs": emails });
        return q.post({
            body: postBody,
        });
    }

    /**
     * Gets the user profile of the site owner.
     * 
     */
    public get ownerUserProfile(): Promise<Types.UserProfile> {
        let q = this.getParent(ProfileLoader);
        q.append("sp.userprofiles.profileloader.getowneruserprofile");
        return q.post();
    }

    /**
     * Gets the user profile that corresponds to the current user.
     * 
     */
    public get userProfile(): Promise<Types.UserProfile> {
        let q = new ProfileLoader(this, "getuserprofile");
        return q.post();
    }

    /**
     * Enqueues creating a personal site for this user, which can be used to share documents, web pages, and other files.
     * 
     * @param interactiveRequest true if interactively (web) initiated request, or false if non-interactively (client) initiated request
     */
    public createPersonalSite(interactiveRequest = false): Promise<void> {
        let q = new ProfileLoader(this, `getuserprofile/createpersonalsiteenque(${interactiveRequest})",`);
        return q.post();
    }

    /**
     * Sets the privacy settings for this profile.
     * 
     * @param share true to make all social data public; false to make all social data private.
     */
    public shareAllSocialData(share): Promise<void> {
        let q = new ProfileLoader(this, `getuserprofile/shareallsocialdata(${share})",`);
        return q.post();
    }
}












