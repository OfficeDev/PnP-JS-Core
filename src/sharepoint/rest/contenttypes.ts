"use strict";

import { Queryable, QueryableCollection, QueryableInstance } from "./Queryable";

/**
 * Describes a collection of content types
 * 
 */
export class ContentTypes extends QueryableCollection {

    /**
     * Creates a new instance of the ContentTypes class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this content types collection
     */
    constructor(baseUrl: string | Queryable, path = "contenttypes") {
        super(baseUrl, path);
    }

    /**
     * Gets a ContentType by content type id
     */
    public getById(id: string): ContentType {
        let ct: ContentType = new ContentType(this);
        ct.concat(`('${id}')`);
        return ct;
    }
}

/**
 * Describes a single ContentType instance
 * 
 */
export class ContentType extends QueryableInstance {

    /**
     * Creates a new instance of the ContentType class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this content type instance
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }

    /**
     * Gets the description resource
     */
    public get descriptionResource(): Queryable {
        return new Queryable(this, "descriptionResource");
    }

    /**
     * Gets the column (also known as field) references in the content type.
    */
    public get fieldLinks(): Queryable {
        return new Queryable(this, "fieldLinks");
    }

    /**
     * Gets a value that specifies the collection of fields for the content type.
     */
    public get fields(): Queryable {
        return new Queryable(this, "fields");
    }

    /**
     * Gets name resource
     */
    public get nameResource(): Queryable {
        return new Queryable(this, "nameResource");
    }

    /**
     * Gets the parent content type of the content type.
     */
    public get parent(): Queryable {
        return new Queryable(this, "parent");
    }

    /**
     * Gets a value that specifies the collection of workflow associations for the content type.
     */
    public get workflowAssociations(): Queryable {
        return new Queryable(this, "workflowAssociations");
    }

    /**
     * Gets or sets a description of the content type.
     */
    public get description(): Queryable {
        return new Queryable(this, "description");
    }

    /**
     * Gets or sets a value that specifies the name of a custom display form template 
     * to use for list items that have been assigned the content type.
     */
    public get displayFormTemplateName(): Queryable {
        return new Queryable(this, "displayFormTemplateName");
    }

    /**
     * Gets or sets a value that specifies the URL of a custom display form 
     * to use for list items that have been assigned the content type.
     */
    public get displayFormUrl(): Queryable {
        return new Queryable(this, "displayFormUrl");
    }

    /**
     * Gets or sets a value that specifies the file path to the document template 
     * used for a new list item that has been assigned the content type.
     */
    public get documentTemplate(): Queryable {
        return new Queryable(this, "documentTemplate");
    }

    /**
     * Gets a value that specifies the URL of the document template assigned to the content type.
     */
    public get documentTemplateUrl(): Queryable {
        return new Queryable(this, "documentTemplateUrl");
    }

    /**
     * Gets or sets a value that specifies the name of a custom edit form template
     * to use for list items that have been assigned the content type.
     */
    public get editFormTemplateName(): Queryable {
        return new Queryable(this, "editFormTemplateName");
    }

    /**
     * Gets or sets a value that specifies the URL of a custom edit form
     * to use for list items that have been assigned the content type.
     */
    public get editFormUrl(): Queryable {
        return new Queryable(this, "editFormUrl");
    }

    /**
     * Gets or sets a value that specifies the content type group for the content type.
     */
    public get group(): Queryable {
        return new Queryable(this, "group");
    }

    /**
    * Gets or sets a value that specifies whether the content type is unavailable
    * for creation or usage directly from a user interface.
    */
    public get hidden(): Queryable {
        return new Queryable(this, "hidden");
    }

    /**
     * Gets or sets the JSLink for the content type custom form template.
     * NOTE!
     * The JSLink property is not supported on Survey or Events lists.
     * A SharePoint calendar is an Events list.
     */
    public get jsLink(): Queryable {
        return new Queryable(this, "jsLink");
    }

    /**
     * Gets a value that specifies the name of the content type.
     */
    public get name(): Queryable {
        return new Queryable(this, "name");
    }

    /**
     * Gets a value that specifies new form template name of the content type.
     */
    public get newFormTemplateName(): Queryable {
        return new Queryable(this, "newFormTemplateName");
    }

    /**
    * Gets a value that specifies new form url of the content type.
    */
    public get newFormUrl(): Queryable {
        return new Queryable(this, "newFormUrl");
    }

    /**
     * Gets or sets a value that specifies whether changes
     * to the content type properties are denied.
     */
    public get readOnly(): Queryable {
        return new Queryable(this, "readOnly");
    }

    /**
     * Gets a value that specifies the XML Schema representing the content type.
     */
    public get schemaXml(): Queryable {
        return new Queryable(this, "schemaXml");
    }

    /**
     * Gets a value that specifies a server-relative path to the content type scope of the content type.
     */
    public get scope(): Queryable {
        return new Queryable(this, "scope");
    }

    /**
     * Gets or sets whether the content type can be modified.
     */
    public get sealed(): Queryable {
        return new Queryable(this, "sealed");
    }

    /**
     * A string representation of the value of the Id.
     */
    public get stringId(): Queryable {
        return new Queryable(this, "stringId");
    }
}
