import { logger } from './Logger';

export interface WorkflowContext {
  document: Document;
  window: Window;
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

export interface Action {
  name: string;
  run(ctx: WorkflowContext): Promise<ActionResult>;
}

export type Condition = (ctx: WorkflowContext) => boolean | Promise<boolean>;

type Step = { type: 'action'; action: Action } | { type: 'conditional'; condition: Condition; ifTrue?: Action; ifFalse?: Action };

export class WorkflowEngine {
  private steps: Step[] = [];

  addAction(action: Action) {
    this.steps.push({ type: 'action', action });
    return this;
  }

  addConditional(condition: Condition, ifTrue?: Action, ifFalse?: Action) {
    this.steps.push({ type: 'conditional', condition, ifTrue, ifFalse });
    return this;
  }

  async run(ctx: WorkflowContext): Promise<void> {
    logger.info('Workflow started', { steps: this.steps.length });
    for (const [i, step] of this.steps.entries()) {
      try {
        if (step.type === 'action') {
          logger.debug(`Running action ${i + 1}/${this.steps.length}`, { action: step.action.name });
          const res = await step.action.run(ctx);
          if (!res.success) {
            logger.warn(`Action failed: ${step.action.name}`, res);
          }
        } else {
          const cond = await step.condition(ctx);
          logger.debug(`Conditional evaluated`, { result: cond });
          const next = cond ? step.ifTrue : step.ifFalse;
          if (next) {
            const res = await next.run(ctx);
            if (!res.success) logger.warn(`Conditional action failed: ${next.name}`, res);
          }
        }
      } catch (err) {
        logger.error('Workflow step error', { stepIndex: i, error: String(err) });
      }
    }
    logger.info('Workflow completed');
  }
}