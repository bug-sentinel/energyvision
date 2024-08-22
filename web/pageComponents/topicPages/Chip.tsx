import type { ChipData } from '../../types'

type ChipProps = {
  data: ChipData
}

const Chip = ({ data }: ChipProps) => {
  console.log(data.chipTitle)
  return <div>{data.chipTitle}</div>
}

export default Chip
