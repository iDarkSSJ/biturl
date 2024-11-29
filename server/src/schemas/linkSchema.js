import z from 'zod'

const invalidDomains = ['biturl.idark.link']

const linkSchema = z.string().url()

export const validateUrl = (url) => {
  const result = linkSchema.safeParse(url)

  if (!result.success) {
    return { valid: false, error: 'The URL provided is not valid' }
  }

  const hostname = new URL(url).hostname
  if (invalidDomains.some((domain) => hostname.includes(domain))) {
    return { valid: false, error: 'Invalid domain' }
  }
  return { valid: true }
}
