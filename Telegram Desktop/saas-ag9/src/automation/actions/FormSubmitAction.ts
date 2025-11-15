import { Action, WorkflowContext, ActionResult } from '../core/WorkflowEngine';
import { logger } from '../core/Logger';

type FieldMap = Record<string, string>;

export class FormSubmitAction implements Action {
  name = 'FormSubmitAction';
  constructor(private formSelector: string, private fields: FieldMap) {}
  async run(ctx: WorkflowContext): Promise<ActionResult> {
    try {
      const form = ctx.document.querySelector(this.formSelector) as HTMLFormElement | null;
      if (!form) return { success: false, error: `Form not found: ${this.formSelector}` };
      Object.entries(this.fields).forEach(([name, value]) => {
        const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement | null;
        if (input) input.value = value;
      });
      form.dispatchEvent(new Event('submit', { bubbles: true }));
      logger.info('Form submitted', { form: this.formSelector });
      return { success: true };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }
}