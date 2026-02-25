import { z } from 'zod'

const schema = z.object({
  urlMaxLength: z.number().int().min(1).max(100000),
})

export default eventHandler(async (event) => {
  const { urlMaxLength } = await readValidatedBody(event, schema.parse)

  await setConfigValue(event, 'urlMaxLength', String(urlMaxLength))

  return { urlMaxLength }
})
