
import { expectSuccessMsg, expectErrorAlert, expectErrorNameRequired, expectErrorEmailRequired, expectErrorMessageRequired } from './hw15-qa-dojo-articles-feedback-objects-page-actions'

export const testData = [
  {
    id: 1,
    description: 'all fields',
    formInfo: {
      name: 'Jordan',
      email: 'mj@example.com',
      message: 'Found mistakes on Article Page',
      subject: 'bug',
      priority: 'high',
      attachment: 'qa-dojo-trainer-hw/tests/test-files/feedback.png',
      sendCopyState: true,
    },
    verify: expectSuccessMsg,
  },
  {
    id: 2,
    description: 'required fields only',
    formInfo: {
      name: 'Paul',
      email: 'paul@example.com',
      message: 'I have some questions on article content',
      subject: 'general',
      priority: 'medium',
      //attachment: 'qa-dojo-trainer-hw/tests/test-files/feedback.png',
      sendCopyState: false,
    },
    verify: expectSuccessMsg,
  },
  {
    id: 3,
    description: 'optional fields only',
    formInfo: {
      name: '',
      email: '',
      message: '',
      subject: 'feature',
      priority: 'low',
      attachment: 'qa-dojo-trainer-hw/tests/test-files/feedback.png',
      sendCopyState: true,
    },
    verify: async function (page) {
      await expectErrorAlert(page);
      await expectErrorNameRequired(page);
      await expectErrorEmailRequired(page);
      await expectErrorMessageRequired(page)
    }

  },
];