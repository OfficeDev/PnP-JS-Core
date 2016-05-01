import { INavigationNode } from "./inavigationnode";

export interface INavigation {
    UseShared: boolean;
    QuickLaunch: Array<INavigationNode>;
}
