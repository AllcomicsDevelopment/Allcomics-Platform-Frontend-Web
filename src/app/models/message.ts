// Define to communicate with server
export type Category = 'notice' | 'faq' | 'inquiry';
export type SubCategory = 'general' | 'etc' | 'payment';
export type Type = 'user' | 'vendor';
export type Status = 'waiting' | 'replied';

export interface Message {
    id: string;
    createdAt: Date;
    category: Category; // 공지사항, FAQ, 자주 묻는 질문 등
    subCategory?: SubCategory; // 일반, 결제 관련, ETC, 등등
    type: Type; // 유저 or 벤더 등등
    title: string; // 제목
    content: string; // 내용. HTML 포맷의 string
    author: string;
    status?: Status; // 답변대기, 답변완료 등등
    reply?: {
        author?: string;
        content?: string;
        createdAt?: Date;
        updatedAt?: Date;
    };
    replier?: string;
    updatedAt?: Date;
    deletedAt?: Date;
}
