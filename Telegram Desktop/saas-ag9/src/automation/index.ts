import { WorkflowEngine } from './core/WorkflowEngine';
import { ClickAction } from './actions/ClickAction';
import { FormSubmitAction } from './actions/FormSubmitAction';
import { NavigateAction } from './actions/NavigateAction';
import { initAutomationAPI } from './integration/AutomationAPI';
import { logger } from './core/Logger';

export function initAutomation() {
  initAutomationAPI();
  logger.info('Automation initialized');
}

export function exampleFlow(): WorkflowEngine {
  return new WorkflowEngine()
    .addAction(new ClickAction('button[data-action="signup"]'))
    .addConditional(() => Boolean(document.querySelector('#contact-form')), new FormSubmitAction('#contact-form', { name: 'John', email: 'john@example.com' }), new NavigateAction('#pricing'));
}