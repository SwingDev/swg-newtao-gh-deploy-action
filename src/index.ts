import * as core from '@actions/core';
import { inspect } from 'util';
import { context } from '@actions/github';

import { DeployCmd } from '@cmds/deploy.cmd';
import { PRCommentRepository } from '@gh/pr-comment.repository';
import { InputParser } from '@input/input.parser';
import { TaoClient } from '@tao/tao.client';

async function run() {
  if (context.payload.pull_request === undefined) {
    core.setFailed('This action does not support non-PR related events.');
    return;
  }

  const intent = InputParser.parse(context);

  const pullNumber = context.payload.pull_request.number;
  const branchName = context.payload.pull_request.head.ref;

  const taoClient = new TaoClient(
    core.getInput('tao-endpoint'),
    core.getInput('tao-access-token'),
  );

  const prCommentRepository = new PRCommentRepository(
    intent.client,
    context.repo.repo,
    context.repo.owner,
    pullNumber,
  );

  if (intent.command === '/deploy') {
    const cmd = new DeployCmd(
      core.getInput('project-id'),
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
