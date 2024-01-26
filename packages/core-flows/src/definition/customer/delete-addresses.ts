import { ICustomerModuleService } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  createStep,
  StepResponse,
} from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

type DeleteCustomerAddressStepInput = string[]

const deleteCustomerAddressesStepId = "delete-customer-addresses"
const deleteCustomerAddressesStep = createStep(
  deleteCustomerAddressesStepId,
  async (ids: DeleteCustomerAddressStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const existing = await service.listAddresses({
      id: ids,
    })
    await service.deleteAddress(ids)

    return new StepResponse(void 0, existing)
  },
  async (prevCustomers, { container }) => {
    if (!prevCustomers) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.addAddresses(prevCustomers)
  }
)

type WorkflowInput = { ids: DeleteCustomerAddressStepInput }

export const deleteCustomerAddressesWorkflowId = "delete-customer-addresses"
export const deleteCustomerAddressesWorkflow = createWorkflow(
  deleteCustomerAddressesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteCustomerAddressesStep(input.ids)
  }
)
