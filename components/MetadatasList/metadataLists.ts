import { Link, LinkType, Media, Slug } from '@prisma/client'
import set from 'lodash.set'

export const general: any[] = [
    {
        value: 'title',
        label: 'Title',
        type: ['string'],
        toValue: (value: [string], meta: any) => ({ ...meta, title: value[0] }),
    },
    {
        value: 'description',
        label: 'Description',
        type: ['string'],
        toValue: (value: [string], meta: any) => ({ ...meta, description: value[0] }),
    },
    {
        value: 'generator',
        label: 'Generator',
        type: ['string'],
        toValue: (value: [string], meta: any) => ({ ...meta, generator: value[0] }),
    },
    {
        value: 'applicationName',
        label: 'Application name',
        type: ['string'],
        toValue: (value: [string], meta: any) => ({ ...meta, applicationName: value[0] }),
    },
    {
        value: 'referrer',
        label: 'Referrer',
        type: ['option'],
        options: [
            'no-referrer',
            'no-referrer-when-downgrade',
            'origin',
            'origin-when-cross-origin',
            'same-origin',
            'strict-origin',
            'strict-origin-when-cross-origin',
            'unsafe-url',
        ],
        toValue: (value: [string], meta: any) => ({ ...meta, referrer: value[0] }),
    },
    {
        value: 'keywords',
        label: 'Keyword',
        type: ['string'],
        multiple: true,
        toValue: (value: [string], meta: any) => ({
            ...meta,
            keywords: [...(meta.keywords || []), ...value],
        }),
    },
    {
        value: 'authors',
        label: 'Author',
        type: ['string'],
        multiple: true,
        toValue: (value: [string], meta: any) => ({
            ...meta,
            authors: [...(meta.authors || []), { name: value[0] }],
        }),
    },
    {
        value: 'authors.url',
        label: 'Author with url',
        type: ['string', 'link'],
        multiple: true,
        noContent: true,
        toValue: (value: [string, Link & { slug: Slug }], meta: any) => ({
            ...meta,
            authors: [
                ...(meta.authors || []),
                {
                    name: value[0],
                    url:
                        value[1].type === LinkType.IN
                            ? `/${value[1].slug.full}`
                            : new URL(`${value[1].prototol?.toLocaleLowerCase()}://${value[1].link}`),
                },
            ],
        }),
    },
    {
        value: 'creator',
        label: 'Creator',
        type: ['string'],
        toValue: (value: [string], meta: any) => ({ ...meta, creator: value[0] }),
    },
    {
        value: 'publisher',
        label: 'Publisher',
        type: ['string'],
        toValue: (value: [string], meta: any) => ({ ...meta, publisher: value[0] }),
    },
    {
        value: 'category',
        label: 'Category',
        type: ['string'],
        toValue: (value: [string], meta: any) => ({ ...meta, category: value[0] }),
    },
    {
        value: 'bookmarks',
        label: 'Bookmarks',
        type: ['link'],
        multiple: true,
        toValue: (value: [string], meta: any) => ({
            ...meta,
            bookmarks: [...(meta.bookmarks || []), ...value],
        }),
    },
    // {
    //     value: 'metadataBase',
    //     label: 'Metadata base',
    //     type: ['link'],
    //     toValue: (value: [Link & { slug: Slug }], meta: any) => ({
    //         ...meta,
    //         metadataBase:
    //             value[0].type === LinkType.IN
    //                 ? `/${value[0].slug.full}`
    //                 : new URL(`${value[0].prototol?.toLocaleLowerCase()}://${value[0].link}`),
    //     }),
    // },
]

export const formatDetection: any[] = [
    {
        value: 'formatDetection.email',
        label: 'Email (Format detection)',
        type: ['boolean'],
        toValue: (value: [boolean], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'formatDetection.email', value[0])
            return copyMeta
        },
    },
    {
        value: 'formatDetection.address',
        label: 'Address (Format detection)',
        type: ['boolean'],
        toValue: (value: [boolean], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'formatDetection.address', value[0])
            return copyMeta
        },
    },
    {
        value: 'formatDetection.telephone',
        label: 'Telephone (Format detection)',
        type: ['boolean'],
        toValue: (value: [boolean], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'formatDetection.telephone', value[0])
            return copyMeta
        },
    },
]

export const openGraph: any[] = [
    {
        value: 'openGraph.title',
        label: 'Title (OG)',
        type: ['string'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'openGraph.title', value[0])
            return copyMeta
        },
    },
    {
        value: 'openGraph.description',
        label: 'Description (OG)',
        type: ['string'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'openGraph.description', value[0])
            return copyMeta
        },
    },
    {
        value: 'openGraph.url',
        label: 'URL (OG)',
        type: ['link'],
        toValue: (value: [Link & { slug: Slug }], meta: any) => {
            const copyMeta = { ...meta }
            const url =
                value[0].type === LinkType.IN
                    ? `/${value[0].slug.full}`
                    : new URL(`${value[0].prototol?.toLocaleLowerCase()}://${value[0].link}`)
            set(copyMeta, 'openGraph.url', url)
            return copyMeta
        },
    },
    {
        value: 'openGraph.siteName',
        label: 'Site name (OG)',
        type: ['string'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'openGraph.siteName', value[0])
            return copyMeta
        },
    },
    {
        value: 'openGraph.type',
        label: 'Type (OG)',
        type: ['option'],
        options: ['website', 'article', 'music', 'video', 'book', 'profile'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'openGraph.type', value[0])
            return copyMeta
        },
    },
    {
        value: 'openGraph.images',
        label: 'Images (OG)',
        type: ['image'],
        multiple: true,
        toValue: (value: [Media], meta: any) => {
            const copyMeta = { ...meta }
            const copyImgs = { ...(copyMeta.openGraph?.images || []) }
            copyImgs.push({
                url: `/storage/${value[0].type.toLocaleLowerCase()}s/${value[0].uri}`,
                // width: 1800,
                // height: 1600,
                alt: value[0].alt,
            })
            set(copyMeta, 'openGraph.images', copyImgs)
            return copyMeta
        },
    },
    {
        value: 'openGraph.authors',
        label: 'Authors (OG)',
        type: ['string'],
        multiple: true,
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            const copyAuths = { ...(copyMeta.openGraph?.authors || []) }
            copyAuths.push(value[0])
            return copyAuths
        },
    },
    {
        value: 'openGraph.publishedTime',
        label: 'Published time (OG)',
        type: ['date'],
        toValue: (value: [Date], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'openGraph.publishedTime', value[0].toISOString())
            return copyMeta
        },
    },
]

export const icons: any[] = [
    {
        value: 'icons.icon',
        label: 'Icon (Icon)',
        type: ['image'],
        toValue: (value: [Media], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'icons.icon', `/storage/${value[0].type.toLocaleLowerCase()}s/${value[0].uri}`)
            return copyMeta
        },
    },
    {
        value: 'icons.shortcut',
        label: 'Shortcut (Icon)',
        type: ['image'],
        toValue: (value: [Media], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'icons.shortcut', `/storage/${value[0].type.toLocaleLowerCase()}s/${value[0].uri}`)
            return copyMeta
        },
    },
    {
        value: 'icons.apple',
        label: 'Apple (Icon)',
        type: ['image'],
        toValue: (value: [Media], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'icons.apple', `/storage/${value[0].type.toLocaleLowerCase()}s/${value[0].uri}`)
            return copyMeta
        },
    },
    {
        value: 'icons.other',
        label: 'Other (Icon)',
        type: ['image'],
        toValue: (value: [Media], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'icons.other', {
                rel: 'apple-touch-icon-precomposed',
                url: `/storage/${value[0].type.toLocaleLowerCase()}s/${value[0].uri}`,
            })
            return copyMeta
        },
    },
]

export const twitter: any[] = [
    {
        value: 'twitter.title',
        label: 'Title (Twttr)',
        type: ['string'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'twitter.title', value[0])
            return copyMeta
        },
    },
    {
        value: 'twitter.card',
        label: 'Card (Twttr)',
        type: ['option'],
        options: ['summary', 'summary_large_image', 'app', 'player'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'twitter.card', value[0])
            return copyMeta
        },
    },
    {
        value: 'twitter.description',
        label: 'Description (Twttr)',
        type: ['string'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'twitter.description', value[0])
            return copyMeta
        },
    },
    {
        value: 'twitter.siteId',
        label: 'Site ID (Twttr)',
        type: ['string'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'twitter.siteId', value[0])
            return copyMeta
        },
    },
    {
        value: 'twitter.creator',
        label: 'Creator (Twttr)',
        type: ['string'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'twitter.creator', value[0])
            return copyMeta
        },
    },
    {
        value: 'twitter.creatorId',
        label: 'Creator ID (Twttr)',
        type: ['string'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'twitter.creatorId', value[0])
            return copyMeta
        },
    },
    {
        value: 'twitter.images',
        label: 'Images (Twttr)',
        type: ['image'],
        multiple: true,
        toValue: (value: [Media], meta: any) => {
            const copyMeta = { ...meta }
            const copyImgs = { ...(copyMeta.twitter?.images || []) }
            copyImgs.push({
                url: `/storage/${value[0].type.toLocaleLowerCase()}s/${value[0].uri}`,
                alt: value[0].alt,
            })
            set(copyMeta, 'twitter.images', copyImgs)
            return copyMeta
        },
    },
]

// app: {
//   name: 'twitter_app',
//   id: {
//     iphone: 'twitter_app://iphone',
//     ipad: 'twitter_app://ipad',
//     googleplay: 'twitter_app://googleplay',
//   },
//   url: {
//     iphone: 'https://iphone_url',
//     ipad: 'https://ipad_url',
//   },
// },

export const iTunes: any[] = [
    {
        value: 'itunes.appId',
        label: 'App Id (ITunes)',
        type: ['string'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'itunes.appId', value[0])
            return copyMeta
        },
    },
    {
        value: 'itunes.appArgument',
        label: 'App Argument (ITunes)',
        type: ['string'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'itunes.appArgument', value[0])
            return copyMeta
        },
    },
]

export const appleWebApp: any[] = [
    {
        value: 'appleWebApp.title',
        label: 'Title (Apple web app)',
        type: ['string'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'appleWebApp.title', value[0])
            return copyMeta
        },
    },
    {
        value: 'appleWebApp.statusBarStyle',
        label: 'Status bar style (Apple web app)',
        type: ['option'],
        options: ['default', 'black', 'black-translucent'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'appleWebApp.statusBarStyle', value[0])
            return copyMeta
        },
    },
    {
        value: 'appleWebApp.startupImage',
        label: 'Startup image (Apple web app)',
        type: ['image'],
        multiple: true,
        toValue: (value: [Media], meta: any) => {
            const copyMeta = { ...meta }
            const copyImgs = { ...(copyMeta.appleWebApp?.startupImage || []) }
            copyImgs.push(`/storage/${value[0].type.toLocaleLowerCase()}s/${value[0].uri}`)
            set(copyMeta, 'appleWebApp.startupImage', copyImgs)
            return copyMeta
        },
    },
]

export const appLinks: any[] = [
    {
        value: 'appLinks.ios.url',
        label: 'IOS url (App links)',
        type: ['link'],
        toValue: (value: [Link & { slug: Slug }], meta: any) => {
            const copyMeta = { ...meta }
            const url =
                value[0].type === LinkType.IN
                    ? `/${value[0].slug.full}`
                    : new URL(`${value[0].prototol?.toLocaleLowerCase()}://${value[0].link}`)
            set(copyMeta, 'appLinks.ios.url', url)
            return copyMeta
        },
    },
    { value: 'appLinks.ios.app_store_id', label: 'IOS id (App links)', type: ['string'] },
    {
        value: 'appLinks.android.package',
        label: 'Android package (App links)',
        type: ['string'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'appLinks.android.package', value[0])
            return copyMeta
        },
    },
    {
        value: 'appLinks.android.app_name',
        label: 'Android appName (App links)',
        type: ['string'],
        toValue: (value: [string], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'appLinks.android.app_name', value[0])
            return copyMeta
        },
    },
    {
        value: 'appLinks.web.url',
        label: 'App web url (App links)',
        type: ['link'],
        toValue: (value: [Link & { slug: Slug }], meta: any) => {
            const copyMeta = { ...meta }
            const url =
                value[0].type === LinkType.IN
                    ? `/${value[0].slug.full}`
                    : new URL(`${value[0].prototol?.toLocaleLowerCase()}://${value[0].link}`)
            set(copyMeta, 'appLinks.web.url', url)
            return copyMeta
        },
    },
    {
        value: 'appLinks.web.should_fallback',
        label: 'Web fallback (App links)',
        type: ['boolean'],
        toValue: (value: [boolean], meta: any) => {
            const copyMeta = { ...meta }
            set(copyMeta, 'appLinks.web.should_fallback', value[0])
            return copyMeta
        },
    },
]

// robots: {
//     index: false,
//     follow: true,
//     nocache: true,
//     googleBot: {
//         index: true,
//         follow: false,
//         noimageindex: true,
//         'max-video-preview': -1,
//         'max-image-preview': 'large',
//         'max-snippet': -1,
//     },
// },

// viewport: {
//     width: 'device-width',
//     initialScale: 1,
//     maximumScale: 1,
// },

// verification: {
//     google: 'google',
//     yandex: 'yandex',
//     yahoo: 'yahoo',
//     other: { me: ['my-email', 'my-link'] },
// },
