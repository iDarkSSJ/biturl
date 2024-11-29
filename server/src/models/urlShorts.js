import { supabase } from './supabaseClient.js'

export class URLmodel {
  static async getUrl(hash) {
    try {
      const { data, error } = await supabase.from('short_links').select('link').eq('hash', hash)

      if (error) {
        throw new Error(`Error fetching URL: ${error.message}`)
      }

      if (data && data.length > 0) {
        let link = data[0].link

        if (!link.startsWith('http://') && !link.startsWith('https://')) {
          link = `http://${link}`
        }

        return { link }
      } else {
        return { error: true }
      }
    } catch (e) {
      console.error('Error interacting with Supabase', e)
      return { error: true }
    }
  }
  static async insertUrl(hash, link) {
    try {
      const { status, data } = await supabase.from('short_links').insert([
        {
          hash,
          link,
        },
      ]).select()

      if (status === 201) {
        return { success: true, data: data }
      } else {
        return { error: true }
      }
    } catch (e) {
      console.error('Error interacting with Supabase', err)
      return { error: true }
    }
  }
  static async checkHash(hash) {
    try {
      const { data, error } = await supabase.from('short_links').select('*').eq('hash', hash)

      if (error) {
        throw new Error(`Error checking URL existence: ${error.message}`)
      } else {
        if (data && data.length > 0) {
          return { exist: true }
        } else {
          return { exist: false }
        }
      }
    } catch (e) {
      console.error('Error interacting with Supabase', e)
      return { error: true }
    }
  }
}
