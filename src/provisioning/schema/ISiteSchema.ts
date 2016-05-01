import { IListInstance } from "./ilistinstance";
import { ICustomAction } from "./icustomaction";
import { IFeature } from "./ifeature";
import { IFile } from "./ifile";
import { INavigation } from "./inavigation";
import { IComposedLook } from "./icomposedlook";
import { IWebSettings } from "./iwebsettings";

export interface SiteSchema {
    Lists: Array<IListInstance>;
    Files: Array<IFile>;
    Navigation: INavigation;
    CustomActions: Array<ICustomAction>;
    ComposedLook: IComposedLook;
    PropertyBagEntries: Object;
    Parameters: Object;
    WebSettings: IWebSettings;
    Features: Array<IFeature>;
}
