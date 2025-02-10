import Comment, { IComment } from './comment';

export default class CommentRepository {
  static async getAllComments(): Promise<IComment[]> {
    return Comment.find();
  }

  static async getCommentById(id: string): Promise<IComment | null> {
    return Comment.findById(id);
  }

  static async addComment(data: Partial<IComment>): Promise<IComment> {
    const comment = new Comment(data);
    return comment.save();
  }
  
  static async updateComment(id: string, data: Partial<IComment>): Promise<IComment | null> {
    return Comment.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteComment(id: string): Promise<IComment | null> {
    return Comment.findByIdAndDelete(id);
  }
}