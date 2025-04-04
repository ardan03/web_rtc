export interface IMessage {
    content: string;
    author?: string;
    timestamp: number;
    userName?: string;
    fileUrl?: string | null;
}