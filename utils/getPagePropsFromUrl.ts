import { Content, ContentField } from '@prisma/client'
import get from 'lodash.get'
import moment from 'moment'
import { prisma } from '../utils/prisma'

const sanitizeDate = (date: Date | string | undefined | null) => (!!date ? moment(date).valueOf() : null)

const sanitizeAll = <T>(props: T) => {
    // console.log('props in', props)
    let newProps = {
        ...props,
        contents:
            get(props, 'contents', null)?.map((content: Content) => ({
                ...content,
                updatedAt: sanitizeDate(content.updatedAt),
                slug: [
                    {
                        ...get(content, 'slug.0', {}),
                        updatedAt: sanitizeDate(get(content, 'slug.0.updatedAt', null)),
                    },
                ],
                fields: get(content, 'fields', [])?.map((field: ContentField) => ({
                    ...field,
                    dateValue: sanitizeDate(get(field, 'dateValue')),
                    media: {
                        ...get(field, 'media', {}),
                        uploadTime: sanitizeDate(get(field, 'media.uploadTime')),
                    },
                })),
            })) || null,
        container: get(props, 'container', null)
            ? {
                  ...get(props, 'container', {}),
                  updatedAt: sanitizeDate(get(props, 'container.updatedAt')),

                  contentSections: null,
              }
            : null,
        fields:
            get(props, 'fields', null)?.map((field: ContentField) => ({
                ...field,
                dateValue: sanitizeDate(get(field, 'dateValue')),
                media: {
                    ...get(field, 'media', {}),
                    uploadTime: sanitizeDate(get(field, 'media.uploadTime')),
                },
            })) || null,
        updatedAt: sanitizeDate(get(props, 'updatedAt')),
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
                            slug: true,
                        },
                    },
                },
            },
            content: {
                include: {
                    metadatas: true,
                    accesses: true,
                    sections: { include: { form: true } },
                    fields: { include: { media: true } },
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

    const background_color = await prisma.setting.findUnique({
        where: { name: 'background_color' },
    })

    const primary_color = await prisma.setting.findUnique({
        where: { name: 'primary_color' },
    })

    const secondary_color = await prisma.setting.findUnique({
        where: { name: 'secondary_color' },
    })

    const props = sanitizeAll({
        appName: appName?.value || '',
        theme: {
            background: background_color?.value || null,
            primary: primary_color?.value || null,
            secondary: secondary_color?.value || null,
        },
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
