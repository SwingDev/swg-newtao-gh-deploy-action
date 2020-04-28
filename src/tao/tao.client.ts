import { Gaxios } from 'gaxios';

export interface DomainAssignmentConfigDTO {
  service_name: string;
  service_port: string;
  uri: string;
}

export interface EnvironmentResponseDTO {
  created_at: string;
  domain_assignment_done: boolean;
  id: string;
  load_balancer_done: boolean;
  project_id: string;
  runner_configuration_done: boolean;
  runner_done: boolean;
  started_at: string | null;
  stopped_at: string | null;
  trigger_from_branch: string;
  trigger_from_repository: string;
  domain_assignment: DomainAssignmentConfigDTO[];
  load_balancer_config: DomainAssignmentConfigDTO[];
}

export class TaoClient {
  private client: Gaxios;

  constructor(
    baseURL = 'https://api.swingdevenvs.com',
    accessToken?: string,
  ) {
    const headers = {};

    if (accessToken !== undefined) {
      headers['X-Access-Token'] = accessToken;
    }

    this.client = new Gaxios({
      baseURL,
      headers,
      retryConfig: {
        retry: 4,
      },
    });
  }

  public async createEnvironment(
    projectId: string,
    triggerFromRepository: string,
    triggerFromBranch = 'master',
  ): Promise<EnvironmentResponseDTO> {
    const res = await this.client.request<EnvironmentResponseDTO>({
      method: 'POST',
      url: `/project/${projectId}/environment`,
      data: {
        trigger_from_branch: triggerFromBranch,
        trigger_from_repository: triggerFromRepository,
      },
    });

    return res.data;
  }

  public async getEnvironment(
    projectId: string,
    environmentId: string,
  ): Promise<EnvironmentResponseDTO> {
    const res = await this.client.request<EnvironmentResponseDTO>({
      method: 'GET',
      url: `/project/${projectId}/environment/${environmentId}`,
    });

    return res.data;
  }

  public async startEnvironment(projectId: string, environmentId: string): Promise<void> {
    await this.client.request({
      method: 'POST',
      url: `/project/${projectId}/environment/${environmentId}/start`,
    });
  }

  // public async stopEnvironment(projectId: string, environmentId: string): Promise<void> {
  //   await this.client.request({
  //     method: 'POST',
  //     url: `/project/${projectId}/environment/${environmentId}/stop`
  //   });
  // }
  //
  // public async deleteEnvironment(projectId: string, environmentId: string): Promise<void> {
  //   await this.client.request({
  //     method: 'DELETE',
  //     url: `/project/${projectId}/environment/${environmentId}`
  //   });
  // }
}
