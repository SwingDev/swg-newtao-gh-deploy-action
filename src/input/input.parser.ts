import { Context } from '@actions/github/lib/context';
import { UnprocessableInputError } from './errors';

interface ParsedResult {
  commentId: number;

  command: string;
  args: string;
}

export class InputParser {
  public static parse(context: Context): ParsedResult {
    const commentBody = context.payload.comment.body;
    const commentId = context.payload.comment.id;

    if (commentBody[0] !== '/') {
      throw new UnprocessableInputError();
    }

    const components = commentBody.split(' ');

    return {
      commentId,
      command: components[0],
      args: components.slice(1),
    };
  }
}
