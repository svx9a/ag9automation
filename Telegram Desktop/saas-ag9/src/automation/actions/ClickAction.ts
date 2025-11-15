import { Action, WorkflowContext, ActionResult } from '../core/WorkflowEngine';
import { logger } from '../core/Logger';

export class ClickAction implements Action {
  name = 'ClickAction';
  constructor(private selector: string) {}
  async run(ctx: WorkflowContext): Promise<ActionResult> {
    try {
      const el = ctx.document.querySelector(this.selector) as HTMLElement | null;
      if (!el) return { success: false, error: `Element not found: ${this.selector}` };
      el.click();
      logger.info('Clicked element', { selector: this.selector });
      return { success: true };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }
}