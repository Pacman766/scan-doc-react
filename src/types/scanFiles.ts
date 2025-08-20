export type File = {
    fileName: string,
    result: string
}

export type Page = {
    number: number,
    type: string,
    content: string,
    description?: string,
    degree?: number | null;
}

export const initialState: PageState = {
    pages: [],
    error: null,
    loading: false
};

export type PageState = {
    pages: Page[] | null,
    error: null | string,
    loading: boolean
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
        result: string | null;
        description?: string | null;
    };
}