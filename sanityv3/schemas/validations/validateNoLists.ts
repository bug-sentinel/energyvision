import type { PortableTextBlock, PortableTextTextBlock, ValidationContext } from 'sanity'

export const validateNoLists = (value: PortableTextBlock[], context: ValidationContext) => {
  const { path } = context
  if (!value || !path) {
    return true
  }

  // get all listItems
  const listItems = value.filter(
    (block: PortableTextBlock) => block._type == 'block' && Boolean(block.listItem as PortableTextBlock['listItem']),
  ) as PortableTextTextBlock[]

  // get all list paths
  const listPaths = listItems?.map((listItem) => listItem._key)

  if (listPaths?.length > 0) {
    return {
      message: 'Lists are not allowed. Please remove the list formatting.',
      paths: listPaths,
    }
  }

  return true
}
