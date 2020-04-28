import { PRCommentRepository } from '@gh/pr-comment.repository';
import { EnvironmentResponseDTO, TaoClient } from '@tao/tao.client';
import { Poller } from '@utils/poller';
import { PollNoLonger } from '@utils/errors';

export class DeployCmd {
  constructor(
    private projectId: string,
    private triggeredByCommentId: number,
    private triggerFromRepository: string,
    private triggerFromBranch: string,
    private taoClient: TaoClient,
    private prCommentRepository: PRCommentRepository,
  ) {
  }

  public static messageFromEnv(env: EnvironmentResponseDTO): string {
    const components: string[] = [];

    components.push(`**Environment ID:** ${env.id}`);

    if (env.load_balancer_config === null) {
      components.push('', 'Domains have not been assigned yet.');
    } else {
      components.push('', 'After they\'re built, you\'ll find your services at:');

      components.push(
        ...env.load_balancer_config.map(
          (l) => `- [${l.service_name}:${l.service_port}](${l.uri})`,
        ),
      );
    }

    components.push('', 'Progress:');
    components.push(`-\tDomain assignment: ${env.domain_assignment_done ? ':+1:' : ':soon:'}`);
    components.push(`-\tConfiguration: ${env.runner_configuration_done ? ':+1:' : ':soon:'}`);
    components.push(`-\tInstances: ${env.runner_done ? ':+1:' : ':soon:'}`);
    components.push(`-\tLoad Balancer: ${env.load_balancer_done ? ':+1:' : ':soon:'}`);

    components.push('');
    components.push('*Note: After it\'s all up you\'ll still have to wait for the Docker containers to get built and run.*');

    return components.join('\n');
  }

  public async run() {
    const env = await this.taoClient.createEnvironment(
      this.projectId,
      this.triggerFromRepository,
      this.triggerFromBranch,
    );

    await this.taoClient.startEnvironment(env.project_id, env.id);

    await this.prCommentRepository.addReaction(this.triggeredByCommentId, 'rocket');

    const comment = await this.prCommentRepository.addComment(DeployCmd.messageFromEnv(env));

    await new Poller(600 * 1000, 10 * 1000, async () => {
      const updatedEnv = await this.taoClient.getEnvironment(env.project_id, env.id);

      await this.prCommentRepository.updateComment(
        comment.id,
        DeployCmd.messageFromEnv(updatedEnv),
      );

      if (updatedEnv.load_balancer_done) {
        throw new PollNoLonger();
      }
    }).promise;
  }
}
