// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

type BlogPostSchema = {
    title: string, 
    description: string, 
    publicationDate: Date,
    updatedDate?: Date
}

const blogPostSchema = z.object({
    title: z.string(),
    description: z.string(),
    publicationDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }) satisfies z.ZodType<BlogPostSchema>

// 3. Define your collection(s)
const blog = defineCollection(
    {
        loader: glob({pattern: '*.md', base: ".posts/"}),
        schema: blogPostSchema
    }
);

// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog };