import { GitHub } from '@actions/github';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

export class PRCommentRepository {
  constructor(
    private octokit: GitHub,
    private repo: string,
    private owner: string,
    private pullNumber: number,
  ) {
  }

  public async addComment(
    body: string,
  ): Promise<RestEndpointMethodTypes['issues']['createComment']['response']['data']> {
    const res = await this.octokit.issues.createComment({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.pullNumber,
      body,
    });

    return res.data;
  }

  public async updateComment(
    commentId: number,
    body: string,
  ): Promise<RestEndpointMethodTypes['issues']['updateComment']['response']['data']> {
    const res = await this.octokit.issues.updateComment({
      owner: this.owner,
      repo: this.repo,
      comment_id: commentId,
      body,
    });

    return res.data;
  }

  public async addReaction(
    commentId: number,
    reaction: '+1' | '-1' | 'laugh' | 'confused' | 'heart' | 'hooray' | 'rocket' | 'eyes',
  ): Promise<RestEndpointMethodTypes['reactions']['createForIssueComment']['response']['data']> {
    const res = await this.octokit.reactions.createForIssueComment({
      owner: this.owner,
      repo: this.repo,
      comment_id: commentId,
      content: reaction,
    });

    return res.data;
  }
}
