import {
  CustomerGroupDTO,
  CreateCustomerGroupDTO,
  ICustomerModuleService,
} from "@medusajs/types"
import {
  StepResponse,
  createStep,
  WorkflowData,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

const createCustomerGroupsStepId = "create-customer-groups"
const createCustomerGroupsStep = createStep(
  createCustomerGroupsStepId,
  async (data: CreateCustomerGroupDTO[], { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const createdCustomerGroups = await service.createCustomerGroup(data)

    return new StepResponse(
      createdCustomerGroups,
      createdCustomerGroups.map(
        (createdCustomerGroups) => createdCustomerGroups.id
      )
    )
  },
  async (createdCustomerGroupIds, { container }) => {
    if (!createdCustomerGroupIds?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.delete(createdCustomerGroupIds)
  }
)

type WorkflowInput = { customersData: CreateCustomerGroupDTO[] }

export const createCustomerGroupsWorkflowId = "create-customer-groups"
export const createCustomerGroupsWorkflow = createWorkflow(
  createCustomerGroupsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerGroupDTO[]> => {
    return createCustomerGroupsStep(input.customersData)
  }
)
