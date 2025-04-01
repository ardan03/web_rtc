export interface IMessage {
    content: string;
    author?: string;
    timestamp: number;
    fileUrl?: string | null;
}