export const product = {
  name: 'product',
  title: 'المنتجات',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'اسم المنتج',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'رابط فرعي (Slug)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'السعر (بالدولار $)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'image',
      title: 'صورة المنتج',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'وصف المنتج',
      type: 'text',
    },
  ],
}