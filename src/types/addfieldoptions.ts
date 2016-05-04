/**
 * Specifies the control settings while adding a field.
 */
export enum AddFieldOptions {
    /**
     *  Specify that a new field added to the list must also be added to the default content type in the site collection
     */
    DefaultValue = 0,
    /**
     * Specify that a new field added to the list must also be added to the default content type in the site collection.
     */
    AddToDefaultContentType = 1,
    /**
     * Specify that a new field must not be added to any other content type
     */
    AddToNoContentType = 2,
    /**
     *  Specify that a new field that is added to the specified list must also be added to all content types in the site collection
     */
    AddToAllContentTypes = 4,
    /**
     * Specify adding an internal field name hint for the purpose of avoiding possible database locking or field renaming operations
     */
    AddFieldInternalNameHint = 8,
    /**
     * Specify that a new field that is added to the specified list must also be added to the default list view
     */
    AddFieldToDefaultView = 16,
    /**
     * Specify to confirm that no other field has the same display name
     */
    AddFieldCheckDisplayName = 32
}

