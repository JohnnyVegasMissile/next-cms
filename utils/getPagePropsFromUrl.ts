import { ContainerField, Content, ContentField } from '@prisma/client'
import get from 'lodash.get'
import moment from 'moment'
import { prisma } from '../utils/prisma'

const sanitizeDate = (date: Date | string | undefined | null) => (!!date ? moment(date).valueOf() : null)

const sanitizeAll = <T>(props: T) => {
    // console.log('props in', props)
    let newProps = {
        ...props,
        metadatas: [
            ...get(props, 'metadatas', []),
            ...get(props, 'container.fields', [])
                .filter((e: ContainerField) => !!e.metadata)
                .map((field: ContainerField) => {
                    const values = get(props, 'fields', []).find((e: ContentField) => e.name === field.name)
                    let content = ''

                    switch (values?.type) {
                        case 'string':
                        case 'text':
                        case 'link':
                            content = get(values, 'textValue', '')
                            break
                        case 'int':
                            content = get(values, 'numberValue', '')
                            break
                        case 'boolean':
                            content = get(values, 'boolValue', '')
                            break
                        case 'date':
                            content = get(values, 'dateValue', '')
                            break
                    }

                    return {
                        id: field.id,
                        name: field.metadata,
                        content,
                    }
                }),
        ],
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
                  fields: null,
              }
            : null,
        fields:
            get(props, 'fields', undefined)?.map((field: ContentField) => ({
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
                    contentSections: { include: { form: true } },
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
                            fields: true,
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

    const header = await prisma.section.findMany({
        where: { type: 'header' },
        include: { form: true },
    })

    const topBody = await prisma.section.findMany({
        where: { type: 'top-body' },
        include: { form: true },
    })

    const bottomBody = await prisma.section.findMany({
        where: { type: 'bottom-body' },
        include: { form: true },
    })

    const footer = await prisma.section.findMany({
        where: { type: 'footer' },
        include: { form: true },
    })

    const props = sanitizeAll({
        appName: appName?.value || '',
        theme: {
            background: background_color?.value || null,
            primary: primary_color?.value || null,
            secondary: secondary_color?.value || null,
        },
        layout: { header, topBody, bottomBody, footer },
        type: !!releatedSlug?.container ? 'container' : 'content',
        ...get(releatedSlug, 'container', {}),
        ...get(releatedSlug, 'content', {}),
        sections: !!releatedSlug?.container
            ? get(releatedSlug, 'container.sections', {})
            : releatedSlug?.content?.container?.contentHasSections
            ? get(releatedSlug, 'content.container.contentSections', [])
            : get(releatedSlug, 'content.sections', []),
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
