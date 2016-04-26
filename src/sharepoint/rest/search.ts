"use strict";

import { Queryable} from "./Queryable";

/**
 * Describes the search API
 * 
 */
export class Search extends Queryable {

    /**
     * Creates a new instance of the Search class
     * 
     * @param baseUrl The url for the search context
     * @param query The SearchQuery object to execute
     */

    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "Search");
    }

    /**
     * A string that contains the text for the search query. 
     */
    public QueryText: string = "*";

    /**
     * A string that contains the text that replaces the query text, as part of a query transform. 
     */
    public QueryTemplate: string = null;

    /**
     * A Boolean value that specifies whether the result tables that are returned for 
     * the result block are mixed with the result tables that are returned for the original query. 
     */
    public EnableInterleaving: Boolean = true;

    /**
     * A Boolean value that specifies whether stemming is enabled. 
     */
    public EnableStemming: Boolean = true;

    /**
     * A Boolean value that specifies whether duplicate items are removed from the results. 
     */
    public TrimDuplicates: Boolean = true;

    /**
     * A Boolean value that specifies whether the exact terms in the search query are used to find matches, or if nicknames are used also. 
     */
    public EnableNicknames: Boolean = false;

    /**
     * A Boolean value that specifies whether the query uses the FAST Query Language (FQL).
     */
    public EnableFql: Boolean = false;

    /**
     * A Boolean value that specifies whether the phonetic forms of the query terms are used to find matches.
     */
    public EnablePhonetic: Boolean = false;

    /**
     * A Boolean value that specifies whether to perform result type processing for the query.
     */
    public BypassResultTypes: Boolean = false;

    /**
     * A Boolean value that specifies whether to return best bet results for the query.
     * This parameter is used only when EnableQueryRules is set to true, otherwise it is ignored.
     */
    public ProcessBestBets: Boolean = false;

    /**
     * A Boolean value that specifies whether to enable query rules for the query.
     */
    public EnableQueryRules: Boolean = false;

    /**
     * A Boolean value that specifies whether to sort search results. 
     */
    public EnableSorting: Boolean = null;

    /**
     * Specifies whether to return block rank log information in the BlockRankLog property of the interleaved result table. 
     * A block rank log contains the textual information on the block score and the documents that were de-duplicated.
     */
    public GenerateBlockRankLog: Boolean = null;

    /**
     * The result source ID to use for executing the search query.  
     */
    public SourceId: string = null;

    /**
     * The ID of the ranking model to use for the query.  
     */
    public RankingModelId: string = null;

    /**
     * The first row that is included in the search results that are returned. 
     * You use this parameter when you want to implement paging for search results.
     */
    public StartRow: Number = null;

    /**
     * The maximum number of rows overall that are returned in the search results. 
     * Compared to RowsPerPage, RowLimit is the maximum number of rows returned overall.
     */
    public RowLimit: Number = null;

    /**
     * The maximum number of rows to return per page. 
     * Compared to RowLimit, RowsPerPage refers to the maximum number of rows to return per page,
     * and is used primarily when you want to implement paging for search results.
     */
    public RowsPerPage: Number = null;

    /**
     * The managed properties to return in the search results.  
     */
    public SelectProperties: string[] = [];

    /**
     * The locale ID (LCID) for the query.  
     */
    public Culture: Number = null;

    /**
     * The set of refinement filters used when issuing a refinement query (FQL)  
     */
    public RefinementFilters: string[] = [];

     /**
      * The set of refiners to return in a search result.
      */
    public Refiners: string[] = [];

    /**
     * The additional query terms to append to the query.
     */
    public HiddenConstraints: string = null;

    /**
     * The list of properties by which the search results are ordered.
     */
    public SortList: Sort[] = [];

    /**
     * The amount of time in milliseconds before the query request times out. 
     */
    public Timeout: Number = 30000;

    /**
     * The properties to highlight in the search result summary when the property value matches the search terms entered by the user.
     */
    public HithighlightedProperties: string[] = [];

    /**
     * The type of the client that issued the query.
     */
    public ClientType: string = null;

    /** 
     * The GUID for the user who submitted the search query.
     */
    public PersonalizationData: string = null;

    /** 
     * The URL for the search results page.
     */
    public ResultsURL: string = null;

    /** 
     * Custom tags that identify the query. You can specify multiple query tags
     */
    public QueryTag: string[] = [];

    // TODO: Properties

    // TODO: ReorderingRules

    /**
     *  A Boolean value that specifies whether to return personal favorites with the search results.
     */
    public ProcessPersonalFavorites: Boolean = null;

    /**
     * The location of the queryparametertemplate.xml file. This file is used to enable anonymous users to make Search REST queries.
     */
    public QueryTemplatePropertiesUrl: string = null;

    /**
     * The number of properties to show hit highlighting for in the search results.
     */
    public HitHighlightedMultivaluePropertyLimit: Number = null;

    /**
     * A Boolean value that specifies whether the hit highlighted properties can be ordered.
     */
    public EnableOrderingHitHighlightedProperty: Boolean = null;

    /**
     * The managed properties that are used to determine how to collapse individual search results. 
     * Results are collapsed into one or a specified number of results if they match any of the individual collapse specifications. 
     * In a collapse specification, results are collapsed if their properties match all individual properties in the collapse specification.
     */
    public CollapseSpecification: String = null;

    /**
     * The locale identifier (LCID) of the user interface
     */
    public UIlanguage: Number = null;

    /**
     * The preferred number of characters to display in the hit-highlighted summary generated for a search result.
     */
    public DesiredSnippetLength: Number = null;

    /**
     * The maximum number of characters to display in the hit-highlighted summary generated for a search result.
     */
    public MaxSnippetLength: Number = null;

    /**
     * The number of characters to display in the result summary for a search result.
     */
    public SummaryLength: Number = null;

    /**
     * .......
     * @returns Promise
     */
    public getSearchResults(): Promise<any> {

        let q = new Queryable("_api/search/query");

        q.query.add("querytext", `'${this.QueryText}'`);

        if (this.QueryTemplate) {
            q.query.add("QueryTemplate", this.QueryTemplate);
        }

        q.query.add("EnableInterleaving", this.EnableInterleaving.toString());
        q.query.add("EnableStemming", this.EnableStemming.toString());
        q.query.add("TrimDuplicates", this.TrimDuplicates.toString());
        q.query.add("EnableNicknames", this.EnableNicknames.toString());
        q.query.add("EnablePhonetic", this.EnablePhonetic.toString());
        q.query.add("EnableFql", this.EnableFql.toString());
        q.query.add("BypassResultTypes", this.BypassResultTypes.toString());
        q.query.add("EnableQueryRules", this.EnableQueryRules.toString());

        if (this.ProcessPersonalFavorites) {
            q.query.add("ProcessPersonalFavorites", this.ProcessPersonalFavorites.toString());
        }

        if (this.EnableQueryRules === true) {
            q.query.add("ProcessBestBets", this.ProcessBestBets.toString());
        }

        if (this.SourceId) {
            q.query.add("SourceId", this.SourceId);
        }

        if (this.RankingModelId) {
            q.query.add("RankingModelId", this.RankingModelId);
        }

        if (this.StartRow) {
            q.query.add("StartRow", this.StartRow.toString());
        }

        if (this.RowLimit) {
            q.query.add("RowLimit", this.RowLimit.toString());
        }

        if (this.RowsPerPage) {
            q.query.add("RowsPerPage", this.RowsPerPage.toString());
        }

        if (this.SelectProperties.length > 0) {
            q.query.add("SelectProperties", `'${this.SelectProperties.toString()}'`);
        }

        if (this.Culture) {
            q.query.add("Culture", this.Culture.toString());
        }

        if (this.RefinementFilters.length > 0) {
            q.query.add("RefinementFilters", `'${this.RefinementFilters.toString()}'`);
        }

        if (this.Refiners.length > 0) {
            q.query.add("Refiners", `'${this.Refiners.toString()}'`);
        }

        if (this.HiddenConstraints) {
            q.query.add("HiddenConstraints", this.HiddenConstraints);
        }

        if (this.SortList.length > 0) {
            let sort: string;
            sort = "'";
            for (let sortItem of this.SortList) {
                sort += `${sortItem.Property}:${sortItem.Direction},`;
            }
            sort += "'";

            q.query.add("SortList", sort);

            // set sorting to true, as SortList has been defined
            this.EnableSorting = true;
        }

        if (this.ClientType) {
            q.query.add("ClientType", this.ClientType.toString());
        }

        q.query.add("Timeout", this.Timeout.toString());

        if (this.HithighlightedProperties.length > 0) {
            q.query.add("HithighlightedProperties", `'${this.HithighlightedProperties.toString()}'`);
        }

        if (this.PersonalizationData) {
            q.query.add("PersonalizationData", this.PersonalizationData.toString());
        }

        if (this.ResultsURL) {
            q.query.add("PersonalizationData", this.ResultsURL.toString());
        }

        // query tags are separated by semicolon
        if (this.QueryTag.length > 0) {
            let queryTag: string;
            queryTag = "'";
            for (let sortItem of this.QueryTag) {
                queryTag += `${sortItem};`;
            }
            queryTag += "'";

            q.query.add("QueryTag", queryTag);
        }

        if (this.QueryTag.length > 0) {
            q.query.add("QueryTag", `'${this.Refiners.toString()}'`.replace(",", ";"));
        }

        if (this.QueryTemplatePropertiesUrl) {
            q.query.add("QueryTemplatePropertiesUrl", this.QueryTemplatePropertiesUrl);
        }

        if (this.HitHighlightedMultivaluePropertyLimit) {
            q.query.add("HitHighlightedMultivaluePropertyLimit", this.HitHighlightedMultivaluePropertyLimit.toString());
        }

        if (this.EnableOrderingHitHighlightedProperty) {
            q.query.add("EnableOrderingHitHighlightedProperty", this.EnableOrderingHitHighlightedProperty.toString());
        }

        if (this.CollapseSpecification) {
            q.query.add("CollapseSpecification", this.CollapseSpecification.toString());
        }

        if (this.EnableSorting) {
            q.query.add("EnableSorting", this.EnableSorting.toString());
        }

        if (this.GenerateBlockRankLog) {
            q.query.add("GenerateBlockRankLog", this.GenerateBlockRankLog.toString());
        }

        if (this.UIlanguage) {
            q.query.add("UIlanguage", this.UIlanguage.toString());
        }

        if (this.DesiredSnippetLength) {
            q.query.add("DesiredSnippetLength", this.DesiredSnippetLength.toString());
        }

        if (this.MaxSnippetLength) {
            q.query.add("MaxSnippetLength", this.MaxSnippetLength.toString());
        }

        if (this.SummaryLength) {
            q.query.add("SummaryLength", this.SummaryLength.toString());
        }

        return q.get().then((data) => {
            return new SearchResults(data);
        });

    }

    /**
     * //TODO: implement
     * @returns Promise
     */
    public getSearchResultsByPOST(): Promise<any> {
        let q = new Queryable("_api/search/postquery");

        return q.get();

        // TODO reordering rules in POST
    }

}

/**
 * Describes the SearchResult class 
 */

export class SearchResults {

    /**
     * Creates a new instance of the SearchResult class
     * 
     */
    constructor( response: any) {
        this.PrimarySearchResults = this.formatSearchResults(response.PrimaryQueryResult.RelevantResults.Table.Rows);
        this.RawSearchResults = response;
    }

    public PrimarySearchResults: any = null;
    public RawSearchResults: any = null;

    /**
     * Formats a search results array
     * 
     * @param rawResults The array to process 
     */
    protected formatSearchResults(rawResults: Array<any>): SearchResult[] {

        let results = new  Array<SearchResult>();

        for (let i of rawResults) {
            results.push(new SearchResult(i.Cells));
        }
        return results;

    }

}

export class SearchResult {

    /**
     * Creates a new instance of the SearchResult class
     * 
     */
    constructor( item: Array<any>) {

        for (let i of item) {
            this[i.Key] = i.Value;
        }
    }
}

/**
 * Defines how search results are sorted.
 */
export interface Sort {
    /**
     * The name for a property by which the search results are ordered.
     */
    Property: string;

    /**
     * The direction in which search results are ordered.
     */
    Direction: SortDirection;
}

export enum SortDirection {
    Ascending = 0,
    Descending = 1,
    FQLFormula = 2
}

/**
 * Defines how search results are sorted.
 */
export interface QueryProperty {
    // TODO: define this interface
}

/**
 * Specifies the type value for the property
 */
export enum QueryPropertyValueType {
    None = 0,
    StringType = 1,
    Int32TYpe = 2,
    BooleanType = 3,
    StringArrayType = 4,
    UnSupportedType	= 5
}

/**
 * 
 */
export enum ReorderingRuleMatchType {
    ResultContainsKeyword = 0,
    TitleContainsKeyword = 1,
    TitleMatchesKeyword = 2,
    UrlStartsWith = 3,
    UrlExactlyMatches = 4,
    ContentTypeIs = 5,
    FileExtensionMatches = 6,
    ResultHasTag = 7,
    ManualCondition = 8
}

/*

TODO: Properties of Search to implement in the interface

UIlanguage
DesiredSnippetLength
MaxSnippetLength
SummaryLength
*/
