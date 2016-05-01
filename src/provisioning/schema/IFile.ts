import { IWebPart } from "./iwebpart";
import { IHiddenView } from "./ihiddenview";

export interface IFile {
    Overwrite: boolean;
    Dest: string;
    Src: string;
    Properties: Object;
    RemoveExistingWebParts: boolean;
    WebParts: Array<IWebPart>;
    Views: Array<IHiddenView>;
}
