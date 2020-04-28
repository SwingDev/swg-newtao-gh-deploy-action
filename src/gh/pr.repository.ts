import { GitHub } from '@actions/github';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

export class PRRepository {
  constructor(
    private octokit: GitHub,
    private repo: string,
    private owner: string,
  ) {
  }

  public async getPullRequest(
    pullRequestId: number,
  ): Promise<RestEndpointMethodTypes['pulls']['get']['response']['data']> {
    const res = await this.octokit.pulls.get({
      owner: this.owner,
      repo: this.repo,
      pull_number: pullRequestId,
    });

    return res.data;
  }
}
