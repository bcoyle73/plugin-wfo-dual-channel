import { FlexPlugin } from 'flex-plugin';
import React from 'react';

export default class WfoDualChannelPlugin extends FlexPlugin {
  name = 'WfoDualChannelPlugin';


  init(flex, manager) {

    const {
      serviceConfiguration: {account_sid: accountSid, taskrouter_workspace_sid: workspaceSid},
    } = manager;

    flex.Actions.replaceAction('AcceptTask', (payload, original) => {
      const {task} = payload;
      const {sourceObject: reservation, taskSid, taskChannelUniqueName, attributes} = task;
      return new Promise((resolve, reject) => {
        const reservation = payload.task.sourceObject;
        if (taskChannelUniqueName === 'voice') {
          reservation.conference({
            endConferenceOnExit: false,
            endConferenceOnCustomerExit: true,
            recordingChannels: 'dual',
            recordingStatusCallback:
              `https://webhooks.twilio.com/v1/Accounts/${accountSid}/Workspaces/${workspaceSid}/Tasks/${taskSid}/FlexRecordingWebhook`,
            record: 'true',
          });
        } else {
          original(payload);
        }
        resolve();
      });
    });

  }
}
