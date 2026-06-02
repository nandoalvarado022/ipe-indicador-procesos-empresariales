/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TabType = 'plan' | 'contract' | 'suite' | 'failure' | 'ai';

export interface RoadmapItem {
  id: string;
  text: string;
  section: 'foundations' | 'testing' | 'contracts' | 'failures';
  description: string;
  completed: boolean;
}

export interface ApiContract {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  title: string;
  properties: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'enum';
    required: boolean;
    description: string;
    validationMsg: string;
  }[];
  expectedResponse: string;
}

export interface ExpectationTest {
  id: string;
  description: string;
  selector: string;
  expectationType: 'visible' | 'textEquals' | 'countEquals' | 'statusOk';
  expectedValue: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  log: string[];
}

export interface FailureModesConfig {
  latencyMs: number;
  injectNetworkError: boolean;
  injectSchemaError: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
