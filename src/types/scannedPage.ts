import {FileType} from "../utils/Files";

export type ScannedPageProps = {
    file: FileType;
    index: number;
    onClick: (filenNumber: number) => void;
    highlight: boolean;
    type: string
}