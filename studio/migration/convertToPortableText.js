/* eslint-disable no-console */
//eslint-disable-next-line
import sanityClient from 'part:@sanity/base/client'

const client = sanityClient.withConfig({
  apiVersion: '2021-05-19',
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID || 'h61q9gi9',
  token: process.env.SANITY_STUDIO_MUTATION_TOKEN,
  dataset: 'global-development',
})

const fetchDocuments = () =>
  client.fetch(
    `*[_type == 'page' && length(content[_type == "promoTileArray"].group[count(title)==null])>0][0..100] {_id, _rev, "promotileArray":content[_type == "promoTileArray"].group[count(title)==null] }`,
  )

const buildPatches = (docs) =>
  docs
    .map((doc) =>
      doc.promotileArray.map((promoTile) => ({
        id: doc._id,
        patch: {
          set: {
            [`content..[_key =="${promoTile._key}"].title`]: [
              {
                style: 'normal',
                _type: 'block',
                _key: `${promoTile._key}${Math.floor(Math.random() * 1000)}`,
                children: [
                  {
                    _type: 'span',
                    marks: [],
                    _key: `${promoTile._key}child${Math.floor(Math.random() * 1000)}`,
                    text: `${promoTile.title}`,
                  },
                ],
                markDefs: [],
              },
            ],
          },
          // this will cause the migration to fail if any of the documents has been
          // modified since it was fetched.
          ifRevisionID: doc._rev,
        },
      })),
    )
    .flat()

const createTransaction = (patches) =>
  patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction())

const commitTransaction = (tx) => tx.commit()

const migrateNextBatch = async () => {
  const documents = await fetchDocuments()
  const patches = buildPatches(documents)
  if (patches.length === 0) {
    console.log('No more documents to migrate!')
    return null
  }
  console.log(
    `Migrating batch:\n %s`,
    patches.map((patch) => `${patch.id} => ${JSON.stringify(patch.patch)}`).join('\n'),
  )
  const transaction = createTransaction(patches)
  await commitTransaction(transaction)
  return migrateNextBatch()
}

migrateNextBatch().catch((err) => {
  console.error(err)
  process.exit(1)
})
