import {Page} from "../types/scanFiles";

export type ScannedPageProps = {
    file: Page;
    index: number;
    onClick: (filenNumber: number) => void;
    highlight: boolean;
    type: string
}