"use strict";

import { Queryable, QueryableInstance } from "./queryable";
import { Util } from "../../utils/util";


/**
 * Describes the SearchQuery interface
 */
export interface SearchQuery {

    /**
     * A string that contains the text for the search query. 
     */
    Querytext: string;

    /**
     * A string that contains the text that replaces the query text, as part of a query transform. 
     */
    QueryTemplate?: string;

    /**
     * A Boolean value that specifies whether the result tables that are returned for 
     * the result block are mixed with the result tables that are returned for the original query. 
     */
    EnableInterleaving?: boolean;

    /**
     * A Boolean value that specifies whether stemming is enabled. 
     */
    EnableStemming?: boolean;

    /**
     * A Boolean value that specifies whether duplicate items are removed from the results. 
     */
    TrimDuplicates?: boolean;

    /**
     * A Boolean value that specifies whether the exact terms in the search query are used to find matches, or if nicknames are used also. 
     */
    EnableNicknames?: boolean;

    /**
     * A Boolean value that specifies whether the query uses the FAST Query Language (FQL).
     */
    EnableFql?: boolean;

    /**
     * A Boolean value that specifies whether the phonetic forms of the query terms are used to find matches.
     */
    EnablePhonetic?: boolean;

    /**
     * A Boolean value that specifies whether to perform result type processing for the query.
     */
    BypassResultTypes?: boolean;

    /**
     * A Boolean value that specifies whether to return best bet results for the query.
     * This parameter is used only when EnableQueryRules is set to true, otherwise it is ignored.
     */
    ProcessBestBets?: boolean;

    /**
     * A Boolean value that specifies whether to enable query rules for the query.
     */
    EnableQueryRules?: boolean;

    /**
     * A Boolean value that specifies whether to sort search results. 
     */
    EnableSorting?: boolean;

    /**
     * Specifies whether to return block rank log information in the BlockRankLog property of the interleaved result table. 
     * A block rank log contains the textual information on the block score and the documents that were de-duplicated.
     */
    GenerateBlockRankLog?: boolean;

    /**
     * The result source ID to use for executing the search query.  
     */
    SourceId?: string;

    /**
     * The ID of the ranking model to use for the query.  
     */
    RankingModelId?: string;

    /**
     * The first row that is included in the search results that are returned. 
     * You use this parameter when you want to implement paging for search results.
     */
    StartRow?: number;

    /**
     * The maximum number of rows overall that are returned in the search results. 
     * Compared to RowsPerPage, RowLimit is the maximum number of rows returned overall.
     */
    RowLimit?: number;

    /**
     * The maximum number of rows to return per page. 
     * Compared to RowLimit, RowsPerPage refers to the maximum number of rows to return per page,
     * and is used primarily when you want to implement paging for search results.
     */
    RowsPerPage?: number;

    /**
     * The managed properties to return in the search results.  
     */
    SelectProperties?: string[];

    /**
     * The locale ID (LCID) for the query.  
     */
    Culture?: number;

    /**
     * The set of refinement filters used when issuing a refinement query (FQL)  
     */
    RefinementFilters?: string[];

    /**
     * The set of refiners to return in a search result.
     */
    Refiners?: string;

    /**
     * The additional query terms to append to the query.
     */
    HiddenConstraints?: string;

    /**
     * The list of properties by which the search results are ordered.
     */
    SortList?: Sort[];

    /**
     * The amount of time in milliseconds before the query request times out. 
     */
    Timeout?: number;

    /**
     * The properties to highlight in the search result summary when the property value matches the search terms entered by the user.
     */
    HithighlightedProperties?: string[];

    /**
     * The type of the client that issued the query.
     */
    ClientType?: string;

    /** 
     * The GUID for the user who submitted the search query.
     */
    PersonalizationData?: string;

    /** 
     * The URL for the search results page.
     */
    ResultsURL?: string;

    /** 
     * Custom tags that identify the query. You can specify multiple query tags
     */
    QueryTag?: string[];

    /**
     * Properties to be used to configure the search query
     */
    Properties?: SearchProperty[];

    /**
     *  A Boolean value that specifies whether to return personal favorites with the search results.
     */
    ProcessPersonalFavorites?: boolean;

    /**
     * The location of the queryparametertemplate.xml file. This file is used to enable anonymous users to make Search REST queries.
     */
    QueryTemplatePropertiesUrl?: string;

    /**
     * Special rules for reordering search results. 
     * These rules can specify that documents matching certain conditions are ranked higher or lower in the results. 
     * This property applies only when search results are sorted based on rank. 
     */
    ReorderingRules?: ReorderingRule[];

    /**
     * The number of properties to show hit highlighting for in the search results.
     */
    HitHighlightedMultivaluePropertyLimit?: number;

    /**
     * A Boolean value that specifies whether the hit highlighted properties can be ordered.
     */
    EnableOrderingHitHighlightedProperty?: boolean;

    /**
     * The managed properties that are used to determine how to collapse individual search results. 
     * Results are collapsed into one or a specified number of results if they match any of the individual collapse specifications. 
     * In a collapse specification, results are collapsed if their properties match all individual properties in the collapse specification.
     */
    CollapseSpecification?: string;

    /**
     * The locale identifier (LCID) of the user interface
     */
    UIlanguage?: number;

    /**
     * The preferred number of characters to display in the hit-highlighted summary generated for a search result.
     */
    DesiredSnippetLength?: number;

    /**
     * The maximum number of characters to display in the hit-highlighted summary generated for a search result.
     */
    MaxSnippetLength?: number;

    /**
     * The number of characters to display in the result summary for a search result.
     */
    SummaryLength?: number;

}

/**
 * Describes the search API
 * 
 */
export class Search extends QueryableInstance {

    /**
     * Creates a new instance of the Search class
     *
     * @param baseUrl The url for the search context
     * @param query The SearchQuery object to execute
     */
    constructor(baseUrl: string | Queryable, path = "_api/search/postquery") {
        super(baseUrl, path);
    }

    /**
     *
     * @returns Promise
     */
    public execute(query?: SearchQuery): Promise<SearchResults> {

        // Used with alternative search
        if (typeof query === "undefined" && typeof this.searchQuery !== "undefined") {
            if (typeof this.pageNumValue !== "undefined") {
                this.searchQuery.RowLimit = this.searchQuery.RowLimit || 10;
                this.searchQuery.StartRow = this.searchQuery.RowLimit * (this.pageNumValue - 1) + 1;
            }
            query = this.searchQuery;
        }

        let formattedBody: any;
        formattedBody = query;

        if (formattedBody.SelectProperties) {
            formattedBody.SelectProperties = { results: query.SelectProperties };
        }

        if (formattedBody.RefinementFilters) {
            formattedBody.RefinementFilters = { results: query.RefinementFilters };
        }

        if (formattedBody.SortList) {
            formattedBody.SortList = { results: query.SortList };
        }

        if (formattedBody.HithighlightedProperties) {
            formattedBody.HithighlightedProperties = { results: query.HithighlightedProperties };
        }

        if (formattedBody.ReorderingRules) {
            formattedBody.ReorderingRules = { results: query.ReorderingRules };
        }

        if (formattedBody.Properties) {
            formattedBody.Properties = { results: query.Properties };
        }

        let postBody = JSON.stringify({
            request: Util.extend({
                "__metadata": { "type": "Microsoft.Office.Server.Search.REST.SearchRequest" },
            }, formattedBody),
        });

        return this.post({ body: postBody }).then((data) => new SearchResults(data));
    }

    /**
     * Skips the specified number of search results items
     * 
     * @param startRow The an amount or rows to skip during search request
     */
    public startRow(startRow: number): this {
        this.searchQuery.StartRow = startRow;
        return this;
    }

    /**
     * Sets search results limit
     * 
     * @param rowLimit Limit or rows in a result returned from search
     */
    public rowLimit(rowLimit: number): this {
        this.searchQuery.RowLimit = rowLimit;
        return this;
    }

    /**
     * Sets search results limit
     * 
     * @param pageNum Limit or rows in a result returned from search
     */
    public pageNum(pageNum: number): this {
        this.pageNumValue = pageNum;
        return this;
    }

    /**
     * Stores search query options
     * Used with alternative search
     */
    private searchQuery: SearchQuery;

    /**
     * Stores paged request page number
     * Used with alternative search
     */
    private pageNumValue: number;

    /**
     * Sets search query options
     *
     * @param query The SearchQuery definition
     */
    public setQuery(query: string | SearchQuery): this {
        let finalQuery: SearchQuery;

        if (typeof query === "string") {
            finalQuery = { Querytext: query };
        } else {
            finalQuery = query;
        }

        this.searchQuery = finalQuery;
        return this;
    };
}

/**
 * Describes the SearchResults class, which returns the formatted and raw version of the query response
 */
export class SearchResults {

    public PrimarySearchResults: any;
    public RawSearchResults: any;
    public RowCount: number;
    public TotalRows: number;
    public TotalRowsIncludingDuplicates: number;
    public ElapsedTime: number;

    /**
     * Creates a new instance of the SearchResult class
     * 
     */
    constructor(rawResponse: any) {
        let response = rawResponse.postquery ? rawResponse.postquery : rawResponse;
        this.PrimarySearchResults = this.formatSearchResults(response.PrimaryQueryResult.RelevantResults.Table.Rows);
        this.RawSearchResults = response;
        this.ElapsedTime = response.ElapsedTime;
        this.RowCount = response.PrimaryQueryResult.RelevantResults.RowCount;
        this.TotalRows = response.PrimaryQueryResult.RelevantResults.TotalRows;
        this.TotalRowsIncludingDuplicates = response.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates;
    }

    /**
     * Formats a search results array
     * 
     * @param rawResults The array to process 
     */
    protected formatSearchResults(rawResults: Array<any> | any): SearchResult[] {
        let results = new Array<SearchResult>(),
            tempResults = rawResults.results ? rawResults.results : rawResults;

        for (let i of tempResults) {
            results.push(new SearchResult(i.Cells));
        }

        return results;
    }

}

/**
 * Describes the SearchResult class
 */
export class SearchResult {

    /**
     * Creates a new instance of the SearchResult class
     * 
     */
    constructor(rawItem: Array<any> | any) {
        let item = rawItem.results ? rawItem.results : rawItem;
        for (let i of item) {
            this[i.Key] = i.Value;
        }
    }
}

/**
 * Defines how search results are sorted
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

/**
 * Defines one search property
 */
export interface SearchProperty {
    Name: string;
    Value: SearchPropertyValue;
}

/**
 * Defines one search property value
 */
export interface SearchPropertyValue {
    StrVal: string;
    QueryPropertyValueTypeIndex: QueryPropertyValueType;
}

/**
 * defines the SortDirection enum
 */
export enum SortDirection {
    Ascending = 0,
    Descending = 1,
    FQLFormula = 2
}

/**
 * Defines how ReorderingRule interface, used for reordering results
 */
export interface ReorderingRule {

    /**
     * The value to match on
     */
    MatchValue: string;

    /**
     * The rank boosting
     */
    Boost: number;

    /**
    * The rank boosting
    */
    MatchType: ReorderingRuleMatchType;
}

/**
 * defines the ReorderingRuleMatchType  enum
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

/**
 * Specifies the type value for the property
 */
export enum QueryPropertyValueType {
    None = 0,
    StringType = 1,
    Int32TYpe = 2,
    BooleanType = 3,
    StringArrayType = 4,
    UnSupportedType = 5
}
