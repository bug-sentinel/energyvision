import { Rule } from 'sanity'
export type ChipData = {
    chipTitle: string;
  };
export default {
    name: 'chip',
    type : 'object',
    fields :[{
        name: 'chipTitle',
        type: 'string',
        description:'This is a chip title',
        options:{
            list:['Pine-Apple', 'Banana','Kiwi', 'Mango','Hydrogen'],
            layout: 'radio',
        },
        validation: (Rule: Rule) =>Rule.required()
    
    }],
}