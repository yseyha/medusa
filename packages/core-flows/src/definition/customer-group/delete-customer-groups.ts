import { ICustomerModuleService } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  createStep,
  StepResponse,
} from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

type DeleteCustomerGroupStepInput = string[]

const deleteCustomerGroupStepId = "delete-customer"
const deleteCustomerGroupStep = createStep(
  deleteCustomerGroupStepId,
  async (ids: DeleteCustomerGroupStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.softDeleteCustomerGroup(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevCustomerGroups, { container }) => {
    if (!prevCustomerGroups) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.restoreCustomerGroup(prevCustomerGroups)
  }
)

type WorkflowInput = { ids: DeleteCustomerGroupStepInput }

export const deleteCustomerGroupsWorkflowId = "delete-customers"
export const deleteCustomerGroupsWorkflow = createWorkflow(
  deleteCustomerGroupsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteCustomerGroupStep(input.ids)
  }
)
