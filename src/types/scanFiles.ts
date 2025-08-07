export type File = {
    fileName: string,
    result: string
}

export type Page = {
    description: string,
    number: number,
    content: string,
    type: string
}

export type ISFResponse = {
    files: File[],
    status: {
        result: string,
        description: string,
        code: number
    }
}

export type ISFFResponse = {
    pages: Page[],
    status: {
        result: string,
        description: string,
        code: string
    }
}

export type ScanError = {
    status: {
        result?: string;
        description?: string;
    };
}