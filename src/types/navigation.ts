import {Config} from "./config";
import {Scanner} from "./scanner";

export type NavigationProps = {
    toggleSidebar: () => void;
    onScan: () => void;
    totalPages: number;
    scrollToPage: (page: number) => void;
    handleDeletePage: () => void;
    handleRotatePage: (index: number) => void;
    handleFitMode: () => void;
    config?: Config;
    getScanners: () => Promise<Scanner[]>;
    scanners: Scanner[];
    saveConfig: (newConfig: Config) => void;
    incScale: () => void;
    decScale: () => void;
    handleScaleChange: (newScale: number) => void;
}