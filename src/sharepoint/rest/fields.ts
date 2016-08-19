"use strict";

import { Queryable, QueryableCollection, QueryableInstance } from "./queryable";
import { TypedHash } from "../../collections/collections";
import { Util } from "../../utils/util";
import * as Types from "./types";

/**
 * Describes a collection of Field objects
 *
 */
export class Fields extends QueryableCollection {

    /**
     * Creates a new instance of the Fields class
     *
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable, path = "fields") {
        super(baseUrl, path);
    }

    /**
     * Gets a field from the collection by title
     *
     * @param title The case-sensitive title of the field
     */
    public getByTitle(title: string): Field {
        return new Field(this, `getByTitle('${title}')`);
    }

    /**
     * Gets a field from the collection by using internal name or title
     *
     * @param name The case-sensitive internal name or title of the field
     */
    public getByInternalNameOrTitle(name: string): Field {
        return new Field(this, `getByInternalNameOrTitle('${name}')`);
    }

    /**
     * Gets a list from the collection by guid id
     *
     * @param title The Id of the list
     */
    public getById(id: string): Field {
        let f: Field = new Field(this);
        f.concat(`('${id}')`);
        return f;
    }

    /**
     * Creates a field based on the specified schema
     */
    public createFieldAsXml(xml: string | Types.XmlSchemaFieldCreationInformation): Promise<FieldAddResult> {

        let info: Types.XmlSchemaFieldCreationInformation;
        if (typeof xml === "string") {
            info = { SchemaXml: xml };
        } else {
            info = xml as Types.XmlSchemaFieldCreationInformation;
        }

        let postBody: string = JSON.stringify({
            "parameters":
            Util.extend({
                "__metadata":
                {
                    "type": "SP.XmlSchemaFieldCreationInformation",
                },
            }, info),
        });

        let q: Fields = new Fields(this, "createfieldasxml");

        return q.postAs<any, { Id: string }>({ body: postBody }).then((data) => {
            return {
                data: data,
                field: this.getById(data.Id),
            };
        });
    }

    /**
     * Adds a new list to the collection
     *
     * @param title The new field's title
     * @param fieldType The new field's type (ex: SP.FieldText)
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    public add(title: string, fieldType: string, properties: TypedHash<string | number | boolean> = {}): Promise<FieldAddResult> {

        let postBody: string = JSON.stringify(Util.extend({
            "__metadata": { "type": fieldType },
            "Title": title,
        }, properties));

        return this.postAs<any, { Id: string }>({ body: postBody }).then((data) => {
            return {
                data: data,
                field: this.getById(data.Id),
            };
        });
    }

    /**
     * Adds a new SP.FieldText to the collection
     *
     * @param title The field title
     * @param maxLength The maximum number of characters allowed in the value of the field.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    public addText(title: string, maxLength = 255, properties?: TypedHash<string | number | boolean>): Promise<FieldAddResult> {

        let props: { FieldTypeKind: number } = {
            FieldTypeKind: 2,
        };

        return this.add(title, "SP.FieldText", Util.extend(props, properties));
    }

    /**
     * Adds a new SP.FieldCalculated to the collection
     *
     * @param title The field title.
     * @param formula The formula for the field.
     * @param dateFormat The date and time format that is displayed in the field.
     * @param outputType Specifies the output format for the field. Represents a FieldType value.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    public addCalculated(
        title: string,
        formula: string,
        dateFormat: Types.DateTimeFieldFormatType,
        outputType: Types.FieldTypes = Types.FieldTypes.Text,
        properties?: TypedHash<string | number | boolean>): Promise<FieldAddResult> {

        let props: {
            DateFormat: Types.DateTimeFieldFormatType;
            FieldTypeKind: number;
            Formula: string;
            OutputType: Types.FieldTypes;
        } = {
                DateFormat: dateFormat,
                FieldTypeKind: 17,
                Formula: formula,
                OutputType: outputType,
            };

        return this.add(title, "SP.FieldCalculated", Util.extend(props, properties));
    }

    /**
     * Adds a new SP.FieldDateTime to the collection
     *
     * @param title The field title
     * @param displayFormat The format of the date and time that is displayed in the field.
     * @param calendarType Specifies the calendar type of the field.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    public addDateTime(
        title: string,
        displayFormat: Types.DateTimeFieldFormatType = Types.DateTimeFieldFormatType.DateOnly,
        calendarType: Types.CalendarType = Types.CalendarType.Gregorian,
        friendlyDisplayFormat = 0,
        properties?: TypedHash<string | number | boolean>): Promise<FieldAddResult> {

        let props: {
            DateTimeCalendarType: Types.CalendarType;
            DisplayFormat: Types.DateTimeFieldFormatType;
            FieldTypeKind: number;
            FriendlyDisplayFormat: number;
        } = {
                DateTimeCalendarType: calendarType,
                DisplayFormat: displayFormat,
                FieldTypeKind: 4,
                FriendlyDisplayFormat: friendlyDisplayFormat,
            };

        return this.add(title, "SP.FieldDateTime", Util.extend(props, properties));
    }

    /**
     * Adds a new SP.FieldNumber to the collection
     *
     * @param title The field title
     * @param minValue The field's minimum value
     * @param maxValue The field's maximum value
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    public addNumber(
        title: string,
        minValue?: number,
        maxValue?: number,
        properties?: TypedHash<string | number | boolean>): Promise<FieldAddResult> {

        let props: { FieldTypeKind: number } = { FieldTypeKind: 9 };

        if (typeof minValue !== "undefined") {
            props = Util.extend({ MinimumValue: minValue }, props);
        }

        if (typeof maxValue !== "undefined") {
            props = Util.extend({ MaximumValue: maxValue }, props);
        }

        return this.add(title, "SP.FieldNumber", Util.extend(props, properties));
    }

    /**
     * Adds a new SP.FieldCurrency to the collection
     *
     * @param title The field title
     * @param minValue The field's minimum value
     * @param maxValue The field's maximum value
     * @param currencyLocalId Specifies the language code identifier (LCID) used to format the value of the field
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    public addCurrency(
        title: string,
        minValue?: number,
        maxValue?: number,
        currencyLocalId = 1033,
        properties?: TypedHash<string | number | boolean>): Promise<FieldAddResult> {

        let props: { CurrencyLocaleId: number; FieldTypeKind: number; } = {
            CurrencyLocaleId: currencyLocalId,
            FieldTypeKind: 10,
        };

        if (typeof minValue !== "undefined") {
            props = Util.extend({ MinimumValue: minValue }, props);
        }

        if (typeof maxValue !== "undefined") {
            props = Util.extend({ MaximumValue: maxValue }, props);
        }

        return this.add(title, "SP.FieldCurrency", Util.extend(props, properties));
    }

    /**
     * Adds a new SP.FieldMultiLineText to the collection
     *
     * @param title The field title
     * @param numberOfLines Specifies the number of lines of text to display for the field.
     * @param richText Specifies whether the field supports rich formatting.
     * @param restrictedMode Specifies whether the field supports a subset of rich formatting.
     * @param appendOnly Specifies whether all changes to the value of the field are displayed in list forms.
     * @param allowHyperlink Specifies whether a hyperlink is allowed as a value of the field.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     *
     */
    public addMultilineText(
        title: string,
        numberOfLines = 6,
        richText = true,
        restrictedMode = false,
        appendOnly = false,
        allowHyperlink = true,
        properties?: TypedHash<string | number | boolean>): Promise<FieldAddResult> {

        let props: {
            AllowHyperlink: boolean;
            AppendOnly: boolean;
            FieldTypeKind: number;
            NumberOfLines: number;
            RestrictedMode: boolean;
            RichText: boolean;
        } = {
                AllowHyperlink: allowHyperlink,
                AppendOnly: appendOnly,
                FieldTypeKind: 3,
                NumberOfLines: numberOfLines,
                RestrictedMode: restrictedMode,
                RichText: richText,
            };

        return this.add(title, "SP.FieldMultiLineText", Util.extend(props, properties));
    }

    /**
     * Adds a new SP.FieldUrl to the collection
     *
     * @param title The field title
     */
    public addUrl(
        title: string,
        displayFormat: Types.UrlFieldFormatType = Types.UrlFieldFormatType.Hyperlink,
        properties?: TypedHash<string | number | boolean>
    ): Promise<FieldAddResult> {

        let props: { DisplayFormat: Types.UrlFieldFormatType; FieldTypeKind: number } = {
            DisplayFormat: displayFormat,
            FieldTypeKind: 11,
        };

        return this.add(title, "SP.FieldUrl", Util.extend(props, properties));
    }
}

/**
 * Describes a single of Field instance
 *
 */
export class Field extends QueryableInstance {

    /**
     * Creates a new instance of the Field class
     *
     * @param baseUrl The url or Queryable which forms the parent of this field instance
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }

    /**
      * Gets a value that specifies whether the field can be deleted.
      */
    public get canBeDeleted(): Queryable {
        return new Queryable(this, "canBeDeleted");
    }

    /**
     * Gets a value that specifies the default value for the field.
     */
    public get defaultValue(): Queryable {
        return new Queryable(this, "defaultValue");
    }

    /**
     * Gets a value that specifies the description of the field.
     */
    public get description(): Queryable {
        return new Queryable(this, "description");
    }

    /**
     * Gets a value that specifies the reading order of the field.
     */
    public get direction(): Queryable {
        return new Queryable(this, "direction");
    }

    /**
     * Gets a value that specifies whether to require unique field values in a list or library column.
     */
    public get enforceUniqueValues(): Queryable {
        return new Queryable(this, "enforceUniqueValues");
    }

    /**
     * Gets the name of the entity property for the list item entity that uses this field.
     */
    public get entityPropertyName(): Queryable {
        return new Queryable(this, "entityPropertyName");
    }

    /**
     * Gets a value that specifies whether list items in the list can be filtered by the field value.
     */
    public get filterable(): Queryable {
        return new Queryable(this, "filterable");
    }

    /**
     * Gets a Boolean value that indicates whether the field derives from a base field type.
     */
    public get fromBaseType(): Queryable {
        return new Queryable(this, "fromBaseType");
    }

    /**
     * Gets a value that specifies the field group.
     */
    public get group(): Queryable {
        return new Queryable(this, "group");
    }

    /**
     * Gets a value that specifies whether the field is hidden in list views and list forms.
     */
    public get hidden(): Queryable {
        return new Queryable(this, "hidden");
    }

    /**
     * Gets a value that specifies the field identifier.
     */
    public get id(): Queryable {
        return new Queryable(this, "id");
    }

    /**
     * Gets a Boolean value that specifies whether the field is indexed.
     */
    public get indexed(): Queryable {
        return new Queryable(this, "indexed");
    }

    /**
     * Gets a value that specifies the field internal name.
     */
    public get internalName(): Queryable {
        return new Queryable(this, "internalName");
    }

    /**
     * Gets the name of an external JS file containing any client rendering logic for fields of this type.
     */
    public get jsLink(): Queryable {
        return new Queryable(this, "jsLink");
    }

    /**
     * Gets a value that specifies whether the value of the field is read-only.
     */
    public get readOnlyField(): Queryable {
        return new Queryable(this, "readOnlyField");
    }

    /**
     * Gets a value that specifies whether the field requires a value.
     */
    public get required(): Queryable {
        return new Queryable(this, "required");
    }

    /**
     * Gets a value that specifies the XML schema that defines the field.
     */
    public get schemaXml(): Queryable {
        return new Queryable(this, "schemaXml");
    }

    /**
     * Gets a value that specifies the server-relative URL of the list or the site to which the field belongs.
     */
    public get scope(): Queryable {
        return new Queryable(this, "scope");
    }

    /**
     * Gets a value that specifies whether properties on the field cannot be changed and whether the field cannot be deleted.
     */
    public get sealed(): Queryable {
        return new Queryable(this, "sealed");
    }

    /**
     * Gets a value that specifies whether list items in the list can be sorted by the field value.
     */
    public get sortable(): Queryable {
        return new Queryable(this, "sortable");
    }

    /**
     * Gets a value that specifies a customizable identifier of the field.
     */
    public get staticName(): Queryable {
        return new Queryable(this, "staticName");
    }

    /**
     * Gets value that specifies the display name of the field.
     */
    public get title(): Queryable {
        return new Queryable(this, "title");
    }

    /**
     * Gets a value that specifies the type of the field. Represents a FieldType value.
     * See FieldType in the .NET client object model reference for a list of field type values.
     */
    public get fieldTypeKind(): Queryable {
        return new Queryable(this, "fieldTypeKind");
    }

    /**
     * Gets a value that specifies the type of the field.
     */
    public get typeAsString(): Queryable {
        return new Queryable(this, "typeAsString");
    }

    /**
     * Gets a value that specifies the display name for the type of the field.
     */
    public get typeDisplayName(): Queryable {
        return new Queryable(this, "typeDisplayName");
    }

    /**
     * Gets a value that specifies the description for the type of the field.
     */
    public get typeShortDescription(): Queryable {
        return new Queryable(this, "typeShortDescription");
    }

    /**
     * Gets a value that specifies the data validation criteria for the value of the field.
     */
    public get validationFormula(): Queryable {
        return new Queryable(this, "validationFormula");
    }

    /**
     * Gets a value that specifies the error message returned when data validation fails for the field.
     */
    public get validationMessage(): Queryable {
        return new Queryable(this, "validationMessage");
    }

    /**
     * Updates this field intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param fieldType The type value, required to update child field type properties
     */
    public update(properties: TypedHash<string | number | boolean>, fieldType = "SP.Field"): Promise<FieldUpdateResult> {

        let postBody: string = JSON.stringify(Util.extend({
            "__metadata": { "type": fieldType },
        }, properties));

        return this.post({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {
            return {
                data: data,
                field: this,
            };
        });
    }

    /**
     * Delete this fields
     *
     */
    public delete(): Promise<void> {
        return this.post({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    }

    /**
     * Sets the value of the ShowInDisplayForm property for this field.
     */
    public setShowInDisplayForm(show: boolean): Promise<void> {
        let q: Field = new Field(this, `setshowindisplayform(${show})`);
        return q.post();
    }

    /**
     * Sets the value of the ShowInEditForm property for this field.
     */
    public setShowInEditForm(show: boolean): Promise<void> {
        let q: Field = new Field(this, `setshowineditform(${show})`);
        return q.post();
    }

    /**
     * Sets the value of the ShowInNewForm property for this field.
     */
    public setShowInNewForm(show: boolean): Promise<void> {
        let q: Field = new Field(this, `setshowinnewform(${show})`);
        return q.post();
    }
}

export interface FieldAddResult {
    data: any;
    field: Field;
}

export interface FieldUpdateResult {
    data: any;
    field: Field;
}
