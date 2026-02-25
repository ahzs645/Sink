import type { H3Event } from 'h3'
import { resolveUrlMaxLength } from '#shared/schemas/link'

const CONFIG_PREFIX = 'config:'

export async function getConfigValue(event: H3Event, key: string): Promise<string | null> {
  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  return await KV.get(`${CONFIG_PREFIX}${key}`)
}

export async function setConfigValue(event: H3Event, key: string, value: string): Promise<void> {
  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  await KV.put(`${CONFIG_PREFIX}${key}`, value)
}

export async function getEffectiveUrlMaxLength(event: H3Event): Promise<number> {
  const kvValue = await getConfigValue(event, 'urlMaxLength')
  if (kvValue !== null) {
    return resolveUrlMaxLength(kvValue)
  }
  return resolveUrlMaxLength(useRuntimeConfig(event).public.urlMaxLength)
}
