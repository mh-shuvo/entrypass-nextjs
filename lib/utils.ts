import slugify from "slugify"

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Partial<Record<string, string>> };

type Delegate<W> = { findFirst: (args: { where?: W }) => Promise<unknown> };

export async function generateSlug<W>(
  input: string,
  model: Delegate<W>,
  field: keyof W & string,
  suffix: number = 0
): Promise<string> {
  const baseSlug = slugify(input,{
    lower:true,
    strict:true,
    trim:true
  })
  const slug = suffix === 0 ? baseSlug : `${baseSlug} - ${suffix}`;

  const where = { [field]: slug } as W;
  const existingRecord = await model.findFirst({ where })
  if(!existingRecord){
    return slug;
  }

  return generateSlug(input,model,field,suffix + 1)
}
