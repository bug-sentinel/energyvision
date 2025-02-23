import { NextApiRequest, NextApiResponse } from 'next'
import { sanityClient } from '../../../lib/sanity.server'
import { getNewsArticlesByPage } from '../../../lib/queries/newsroom'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('get next on lang', req.query.lang)
  console.log('get next from req.query.lastId', req.query.lastId)
  console.log('get next from req.query.lastPublishedAt', req.query.lastPublishedAt)
  try {
    const news = await sanityClient.fetch(getNewsArticlesByPage(false, true), {
      lang: req.query.lang,
      lastId: req.query.lastId,
      lastPublishedAt: req.query.lastPublishedAt,
    })
    res.status(200).json({ news: news })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' })
  }
}
