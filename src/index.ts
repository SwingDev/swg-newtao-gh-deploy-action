import { inspect } from 'util';
import * as core from '@actions/core';
import { context, GitHub } from '@actions/github';

import { DeployCmd } from '@cmds/deploy.cmd';
import { PRCommentRepository } from '@gh/pr-comment.repository';
import { InputParser } from '@input/input.parser';
import { TaoClient } from '@tao/tao.client';
import { PRRepository } from '@gh/pr.repository';
import { config } from 'config';

async function run() {
  if (context.payload.issue === undefined) {
    core.setFailed('This action does not support non-PR-comment related events.');
    return;
  }

  const githubClient = new GitHub(config.token);

  const intent = InputParser.parse(context);
  const pullRequestId = context.payload.issue.number;

  const prRepository = new PRRepository(
    githubClient,
    context.repo.repo,
    context.repo.owner,
  );

  const prCommentRepository = new PRCommentRepository(
    githubClient,
    context.repo.repo,
    context.repo.owner,
    pullRequestId,
  );

  const pullRequest = await prRepository.getPullRequest(pullRequestId);
  const branchName = pullRequest.head.ref;

  const taoClient = new TaoClient(config.taoEndpoint, config.taoAccessToken);

  if (intent.command === '/deploy') {
    const cmd = new DeployCmd(
      config.taoProjectId,
      intent.commentId,
      `git@github.com:${context.repo.owner}/${context.repo.owner}.git`,
      branchName,
      taoClient,
      prCommentRepository,
    );

    await cmd.run();
  }
}

run()
  .then(() => {
    core.info('Done');
  })
  .catch((e) => {
    core.debug(inspect(e));
    core.setFailed(e.message);
  });
