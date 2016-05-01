import { IContents } from "./icontents";

export interface IWebPart {
    Title: string;
    Order: number;
    Zone: string;
    Row: number;
    Column: number;
    Contents: IContents;
}
