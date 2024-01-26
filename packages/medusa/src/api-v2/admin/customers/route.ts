import { createCustomersWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateCustomerDTO, ICustomerModuleService } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const customerModuleService = req.scope.resolve<ICustomerModuleService>(
    ModuleRegistrationName.CUSTOMER
  )

  const [customers, count] = await customerModuleService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  const { offset, limit } = req.validatedQuery

  res.json({
    count,
    customers,
    offset,
    limit,
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const createCustomers = createCustomersWorkflow(req.scope)
  const customersData = [req.validatedBody as CreateCustomerDTO]

  const { result, errors } = await createCustomers.run({
    input: { customersData },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ customer: result[0] })
}
