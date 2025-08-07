export type FileType = {
    number: number;
    type: string;
    content: string;
    degree?: number;
};

export const data : FileType[] = [
    {number: 1, type: 'jpg', content: 'jpg/api_page-0001.jpg'},
    {number: 2, type: 'jpg', content: 'jpg/api_page-0002.jpg'},
    {number: 3, type: 'jpg', content: 'jpg/api_page-0003.jpg'},
    {number: 4, type: 'jpg', content: 'jpg/api_page-0004.jpg'}
];

