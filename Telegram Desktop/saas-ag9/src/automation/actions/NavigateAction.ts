import { Action, WorkflowContext, ActionResult } from '../core/WorkflowEngine';
import { logger } from '../core/Logger';

export class NavigateAction implements Action {
  name = 'NavigateAction';
  constructor(private urlOrHash: string) {}
  async run(ctx: WorkflowContext): Promise<ActionResult> {
    try {
      if (this.urlOrHash.startsWith('#')) {
        ctx.window.location.hash = this.urlOrHash;
      } else {
        ctx.window.location.href = this.urlOrHash;
      }
      logger.info('Navigated', { target: this.urlOrHash });
      return { success: true };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }
}