import { prisma } from '~/utilities/prisma'
import { revalidatePath } from 'next/cache'

const revalidateSlug = async (slug: string) => {
    revalidatePath(`/${slug}`)

    return prisma.slug.update({
        where: { full: slug },
        data: { revalidatedAt: new Date() },
    })
}

const revalidateAllSlugs = async () => {
    const slugs = await prisma.slug.findMany()

    revalidatePath('/')
    revalidatePath('/sign-in')

    slugs.forEach(async (slug) => await revalidateSlug(slug.full))
}

export default revalidateAllSlugs
