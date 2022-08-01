import get from 'lodash.get'
import containers from 'pages/api/containers'
import { serialize } from 'v8'
import { prisma } from '../utils/prisma'

const sanitizeDate = (date: Date | string) =>
    !!date ? Math.floor((new Date(date).getMilliseconds() || 1) / 1000) : undefined

const sanitizeAll = <T>(props: T) => {
    let newProps = {
        ...props,
        container: { ...get(props, 'container', {}), updatedAt: sanitizeDate(get(props, 'container', undefined)) },
    }

    return newProps as T
}

const getPagePropsFromUrl = async (slug: string) => {
    const notFound = { notFound: true }

    const releatedSlug = await prisma.slug.findUnique({
        where: { fullSlug: slug },
        include: {
            container: {
                include: {
                    metadatas: true,
                    accesses: true,
                    sections: { include: { form: true } },
                    contents: {
                        include: {
                            fields: {
                                include: { media: true },
                            },
                        },
                    },
                },
            },
            content: {
                include: {
                    metadatas: true,
                    accesses: true,
                    sections: { include: { form: true } },
                    fields: true,
                    container: {
                        include: {
                            contentSections: {
                                include: { form: true },
                            },
                        },
                    },
                },
            },
        },
    })

    const props = sanitizeAll({
        type: !!releatedSlug?.container ? 'container' : 'content',
        ...get(releatedSlug, 'container', {}),
        ...get(releatedSlug, 'content', {}),
        sections: releatedSlug?.content?.container?.contentHasSections
            ? get(releatedSlug, 'container.contentSection', [])
            : get(releatedSlug, 'content.section', []),
        updatedAt: sanitizeDate(
            get(releatedSlug, 'container.updatedAt', get(releatedSlug, 'content.updatedAt', undefined))
        ),
    })

    console.log('props', props)

    if (!releatedSlug || !props.published) {
        return notFound
    }

    const revalidate = await prisma.setting.findUnique({
        where: { name: 'revalidate' },
    })

    return {
        props,
        revalidate: revalidate ? parseInt(revalidate.value) : 60,
    }
}

export default getPagePropsFromUrl
