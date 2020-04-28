import * as core from '@actions/core';

export interface IConfig {
  taoEndpoint: string;
  taoAccessToken: string;
  token: string;
  taoProjectId: string;
}

export const config: IConfig = {
  taoEndpoint: core.getInput('tao-endpoint'),
  taoAccessToken: core.getInput('tao-access-token'),
  token: core.getInput('token'),
  taoProjectId: core.getInput('tao-project-id'),
};
