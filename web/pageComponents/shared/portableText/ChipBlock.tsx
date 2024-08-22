import { PortableTextBlock } from "@portabletext/types";

type ChipProps = {
    _type: string
  _key : string
  chipTitle: string
    
}
type BlockProps = {
  isInline: boolean
  value: ChipProps
  className?: string
} & PortableTextBlock

export const ChipBlock = (block: BlockProps)=>{
  
    return(
      
        <div>
        
            {block.value.chipTitle}
        </div>
    )
}