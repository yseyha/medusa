import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CustomerAddressDTO,
  FilterableCustomerAddressProps,
  ICustomerModuleService,
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

type UpdateCustomerAddresseStepInput = {
  selector: FilterableCustomerAddressProps
  update: Partial<CustomerAddressDTO>
}

const updateCustomerAddresseStepId = "update-customer-addresse"
const updateCustomerAddressesStep = createStep(
  updateCustomerAddresseStepId,
  async (data: UpdateCustomerAddresseStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])
    const prevCustomers = await service.listAddresses(data.selector, {
      select: selects,
      relations,
    })

    const customerAddresses = await service.updateAddress(
      data.selector,
      data.update
    )

    return new StepResponse(customerAddresses, prevCustomers)
  },
  async (prevCustomerAddresses, { container }) => {
    if (!prevCustomerAddresses) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await promiseAll(
      prevCustomerAddresses.map((c) => service.updateAddress(c.id, { ...c }))
    )
  }
)

type WorkflowInput = UpdateCustomerAddresseStepInput

export const updateCustomerAddressesWorkflowId = "update-customer-addresses"
export const updateCustomerAddressesWorkflow = createWorkflow(
  updateCustomerAddressesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerAddressDTO[]> => {
    return updateCustomerAddressesStep(input)
  }
)
