import {IComment} from '../datalayer/comment';
import CommentRepository from '../datalayer/commentRepository';

export default class CommentService {
    static async getComments(): Promise<IComment[]> {
        return CommentRepository.getAllComments();
    }

    static async getCommentById(id: string): Promise<IComment | null> {
        const comment = await CommentRepository.getCommentById(id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        return comment;
    }

    static async createComment(data: Partial<IComment>): Promise<IComment> {
        if (!data.firstName || !data.lastName || !data.comment) {
            throw new Error('First name, last name and comment are required');
        }
        return CommentRepository.addComment(data);
    }

    static async updateComment(id: string, data: Partial<IComment>): Promise<IComment | null> {
        const comment = await CommentRepository.updateComment(id, data);
        if (!comment) {
            throw new Error('Comment not found');
        }
        return comment;
    }

    static async deleteComment(id: string): Promise<IComment | null> {
        const comment = await CommentRepository.deleteComment(id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        return comment;
    }
}