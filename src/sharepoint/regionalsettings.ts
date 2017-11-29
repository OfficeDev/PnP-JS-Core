import { SharePointQueryable, SharePointQueryableInstance, SharePointQueryableCollection } from "./sharepointqueryable";

/**
 * Describes regional settings ODada object
 */
export class RegionalSettings extends SharePointQueryableInstance {

    /**
     * Creates a new instance of the RegionalSettings class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this regional settings collection
     */

    constructor(baseUrl: string | SharePointQueryable, path = "regionalsettings") {
        super(baseUrl, path);
    }

    /**
     * Gets installed languages
     */
    public get installedLanguages(): InstalledLanguages {
        return new InstalledLanguages(this);
    }

    /**
     * Gets time zone
     */
    public get timeZone(): TimeZone {
        return new TimeZone(this);
    }

    /**
     * Gets time zones
     */
    public get timeZones(): TimeZones {
        return new TimeZones(this);
    }

}

export interface RegionalSettingsProps {
    AdjustHijriDays: number;
    AlternateCalendarType: number;
    AM: string;
    CalendarType: number;
    Collation: number;
    CollationLCID: number;
    DateFormat: number;
    DateSeparator: string;
    DecimalSeparator: string;
    DigitGrouping: string;
    FirstDayOfWeek: number;
    FirstWeekOfYear: number;
    IsEastAsia: boolean;
    IsRightToLeft: boolean;
    IsUIRightToLeft: boolean;
    ListSeparator: string;
    LocaleId: number;
    NegativeSign: string;
    NegNumberMode: number;
    PM: string;
    PositiveSign: string;
    ShowWeeks: boolean;
    ThousandSeparator: string;
    Time24: boolean;
    TimeMarkerPosition: number;
    TimeSeparator: string;
    WorkDayEndHour: number;
    WorkDays: number;
    WorkDayStartHour: number;
}

/**
 * Describes TimeZone ODada object
 */
export class TimeZone extends SharePointQueryableInstance {
    constructor(baseUrl: string | SharePointQueryable, path = "timezone") {
        super(baseUrl, path);
    }
}

/**
 * Describes installed languages ODada queriable collection
 */
export class InstalledLanguages extends SharePointQueryableInstance {
    constructor(baseUrl: string | SharePointQueryable, path = "installedlanguages") {
        super(baseUrl, path);
    }
}

/**
 * Describes time zones queriable collection
 */
export class TimeZones extends SharePointQueryableCollection {
  constructor(baseUrl: string | SharePointQueryable, path = "timezones") {
      super(baseUrl, path);
  }
}
