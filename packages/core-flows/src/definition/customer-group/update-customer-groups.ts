import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CustomerGroupDTO,
  FilterableCustomerGroupProps,
  ICustomerModuleService,
  CustomerGroupUpdatableFields,
} from "@medusajs/types"
import {
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  createStep,
  StepResponse,
} from "@medusajs/workflows-sdk"

type UpdateCustomerGroupStepInput = {
  selector: FilterableCustomerGroupProps
  update: CustomerGroupUpdatableFields
}

const updateCustomerGroupStepId = "update-customer-groups"
const updateCustomerGroupsStep = createStep(
  updateCustomerGroupStepId,
  async (data: UpdateCustomerGroupStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])
    const prevCustomerGroups = await service.listCustomerGroups(data.selector, {
      select: selects,
      relations,
    })

    const customers = await service.updateCustomerGroup(
      data.selector,
      data.update
    )

    return new StepResponse(customers, prevCustomerGroups)
  },
  async (prevCustomerGroups, { container }) => {
    if (!prevCustomerGroups) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await promiseAll(
      prevCustomerGroups.map((c) =>
        service.updateCustomerGroup(c.id, {
          name: c.name,
        })
      )
    )
  }
)

type WorkflowInput = UpdateCustomerGroupStepInput

export const updateCustomerGroupsWorkflowId = "update-customer-groups"
export const updateCustomerGroupsWorkflow = createWorkflow(
  updateCustomerGroupsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerGroupDTO[]> => {
    return updateCustomerGroupsStep(input)
  }
)
