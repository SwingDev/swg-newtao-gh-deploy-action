import * as core from '@actions/core';
import { Context } from '@actions/github/lib/context';
import { GitHub } from '@actions/github';
import { UnprocessableInputError } from './errors';

interface ParsedResult {
  client: GitHub;

  commentId: number;

  command: string;
  args: string;
}

export class InputParser {
  public static parse(context: Context): ParsedResult {
    const commentBody = context.payload.comment.body;
    const commentId = context.payload.comment.id;

    const client = new GitHub(core.getInput('repo-token'));

    if (commentBody[0] !== '/') {
      throw new UnprocessableInputError();
    }

    const components = commentBody.split(' ');

    return {
      commentId,
      client,
      command: components[0],
      args: components.slice(1),
    };
  }
}
