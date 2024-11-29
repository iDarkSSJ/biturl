import { URLmodel } from '../models/urlShorts.js'
import { validateUrl } from '../schemas/linkSchema.js'
import { newRandomHash } from '../utils/utils.js'

export class URLcontroller {
  static async getUrl(req, res) {
    const hash = req.params.hash

    const result = await URLmodel.getUrl(hash)

    if (result.error) {
      return res.status(404).send({ error: 'Failed fetching URL' })
    } else {
      return res.redirect(result.link)
    }
  }

  static async createUrl(req, res) {
    try {
      const { link } = req.body

      const isValidUrl = validateUrl(link)
      if (isValidUrl.error) {
        return res.status(400).send({ error: isValidUrl.error })
      }

      // create a random hash

      for (let attempts = 0; attempts < 3; attempts++) {
        const hash = newRandomHash()

        const existingHash = await URLmodel.checkHash(hash)
        if (existingHash.exist) {
          continue
        }

        const result = await URLmodel.insertUrl(hash, link)
        if (!result.error) {
          return res.status(201).send({ hash, link, urlData: result.data })
        }
      }

      return res.status(500).send({ error: 'Failed to create a URL, try again.' })
    } catch (e) {
      console.error('Error creating URL', e)
      return res.status(500).send({ error: 'Failed creating URL' })
    }
  }

  static async createCustomUrl(req, res) {
    const { link, hash, key } = req.body

    // verify if the url is valid
    const isValidUrl = validateUrl(link)
    if (isValidUrl.error) {
      return res.status(400).send({ error: isValidUrl.error })
    }

    // verify the key
    if (key !== process.env.CUSTOM_URL_KEY) {
      return res.status(401).send({ error: 'Invalid key' })
    }

    // check if the hash already exists
    const existingHash = await URLmodel.checkHash(hash)

    if (existingHash.exist) {
      return res.status(409).send({ error: 'Hash already exists' })
    }

    const result = await URLmodel.insertUrl(hash, link)

    if (result.error) {
      return res.status(500).send({ error: 'Failed creating URL' })
    }
    return res.status(201).send({ hash, link })
  }
}
