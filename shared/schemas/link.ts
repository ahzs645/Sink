import { customAlphabet } from 'nanoid'
import { z } from 'zod'

const { slugRegex } = useAppConfig()

const slugDefaultLength = +useRuntimeConfig().public.slugDefaultLength
export const DEFAULT_URL_MAX_LENGTH = 2048
export const SERVER_URL_MAX_LENGTH = 100_000

export const nanoid = (length: number = slugDefaultLength) => customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', length)

export function resolveUrlMaxLength(value: unknown): number {
  const parsedValue = Number.parseInt(String(value), 10)
  if (!Number.isFinite(parsedValue) || parsedValue < 1)
    return DEFAULT_URL_MAX_LENGTH

  return parsedValue
}

export function createLinkSchema(urlMaxLength: number = DEFAULT_URL_MAX_LENGTH) {
  return z.object({
    id: z.string().trim().max(26).default(nanoid(10)),
    url: z.string().trim().url().max(urlMaxLength),
    slug: z.string().trim().max(2048).regex(new RegExp(slugRegex)).default(nanoid()),
    comment: z.string().trim().max(2048).optional(),
    createdAt: z.number().int().safe().default(() => Math.floor(Date.now() / 1000)),
    updatedAt: z.number().int().safe().default(() => Math.floor(Date.now() / 1000)),
    expiration: z.number().int().safe().refine(expiration => expiration > Math.floor(Date.now() / 1000), {
      message: 'expiration must be greater than current time',
      path: ['expiration'],
    }).optional(),
    title: z.string().trim().max(256).optional(),
    description: z.string().trim().max(2048).optional(),
    image: z.string().trim().max(128).optional(),
    apple: z.string().trim().url().max(urlMaxLength).optional(),
    google: z.string().trim().url().max(urlMaxLength).optional(),
    cloaking: z.boolean().optional(),
    redirectWithQuery: z.boolean().optional(),
    password: z.string().trim().min(1).max(128).optional(),
  })
}

export const LinkSchema = createLinkSchema(SERVER_URL_MAX_LENGTH)

export type Link = z.infer<typeof LinkSchema>

export interface ExportData {
  version: string
  exportedAt: string
  count: number
  links: Link[]
  cursor?: string
  list_complete: boolean
}
