/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const {snapshot} = require('./gather/snapshot-runner.js');
const {startTimespan} = require('./gather/timespan-runner.js');
const {navigation} = require('./gather/navigation-runner.js');
const UserFlow = require('./user-flow.js');

/**
 * @param {import('puppeteer').Page} page
 * @param {UserFlow.UserFlowOptions} [options]
 */
async function startFlow(page, options) {
  return new UserFlow(page, options);
}

/**
 * @param {Omit<Parameters<navigation>[0], 'requestor'>} options
 * @return {Promise<{endNavigation: () => ReturnType<navigation>, waitForLoad: () => Promise<void>}>}
 */
async function startNavigation(options) {
  /** @type {ReturnType<navigation>} */
  let endPromise;
  /** @type {Promise<[() => void, () => Promise<void>]>} */
  const continuePromise = new Promise(resolveContinue => {
    /** @type {LH.NavigationRequestor} */
    const requestor = waitForLoad => {
      return new Promise(continueNavigation => {
        resolveContinue([continueNavigation, waitForLoad]);
      });
    };
    endPromise = navigation({...options, requestor});
  });
  const [continueNavigation, waitForLoad] = await continuePromise;

  function endNavigation() {
    continueNavigation();
    return endPromise;
  }

  return {endNavigation, waitForLoad};
}

module.exports = {
  snapshot,
  startTimespan,
  navigation,
  startNavigation,
  startFlow,
};
