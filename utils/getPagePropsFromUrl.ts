import { Content } from '@prisma/client'
import get from 'lodash.get'
import moment from 'moment'
import { prisma } from '../utils/prisma'

const sanitizeDate = (date: Date | string) => (!!date ? moment(date).valueOf() : undefined)

const sanitizeAll = <T>(props: T) => {
    // console.log('props in', props)
    let newProps = {
        ...props,
        contents:
            get(props, 'contents', null)?.map((content: Content) => ({
                ...content,
                updatedAt: sanitizeDate(content.updatedAt),
            })) || null,
        container: get(props, 'container', null)
            ? {
                  ...get(props, 'container', {}),
                  updatedAt: sanitizeDate(get(props, 'container.updatedAt', null)),

                  contentSections: null,
              }
            : null,
        updatedAt: sanitizeDate(get(props, 'updatedAt', null)),
    }

    // console.log('props out', newProps)
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

    const appName = await prisma.setting.findUnique({
        where: { name: 'app_name' },
    })

    const props = sanitizeAll({
        appName: appName?.value || '',
        type: !!releatedSlug?.container ? 'container' : 'content',
        ...get(releatedSlug, 'container', {}),
        ...get(releatedSlug, 'content', {}),
        sections: releatedSlug?.content?.container?.contentHasSections
            ? get(releatedSlug, 'container.contentSection', [])
            : get(releatedSlug, 'content.section', []),
    })

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
