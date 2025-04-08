// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob } from 'astro/loaders';

export type BlogPostSchema = {
    title: string, 
    description: string, 
    publicationDate: Date,
    author: string,
    tags: string[],
    updatedDate?: Date
}

const blogPostSchema = z.object({
    title: z.string(),
    description: z.string(),
    publicationDate: z.coerce.date(),
    author: z.string(),
    tags: z.array(z.string()),
    updatedDate: z.coerce.date().optional(),

  }) satisfies z.ZodType<BlogPostSchema>

// 3. Define your collection(s)
const posts = defineCollection(
    {
        loader: glob({pattern: '*.md', base: ".posts/"}),
        schema: blogPostSchema
    }
);

// 4. Export a single `collections` object to register your collection(s)
export const collections = { posts };