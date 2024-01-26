import {
  ICustomerModuleService,
  CreateCustomerAddressDTO,
  CustomerAddressDTO,
} from "@medusajs/types"
import {
  StepResponse,
  createStep,
  WorkflowData,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

const createCustomerAddressesStepId = "create-customer-addresses"
const createCustomerAddressesStep = createStep(
  createCustomerAddressesStepId,
  async (data: CreateCustomerAddressDTO[], { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const addresses = await service.addAddresses(data)

    return new StepResponse(
      addresses,
      addresses.map((address) => address.id)
    )
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.deleteAddress(ids)
  }
)

type WorkflowInput = { addresses: CreateCustomerAddressDTO[] }

export const createCustomerAddressesWorkflowId = "create-customers"
export const createCustomerAddressesWorkflow = createWorkflow(
  createCustomerAddressesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerAddressDTO[]> => {
    return createCustomerAddressesStep(input.addresses)
  }
)
