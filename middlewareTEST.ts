// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { SettingType } from '@prisma/client'
import { prisma } from '~/utilities/prisma'

const middleware = async (request: NextRequest) => {
    const locales = (await prisma.setting.findUnique({
        where: { type: SettingType.LANGUAGE_LOCALES },
    }))!.value.split(', ')

    const preferred = (await prisma.setting.findUnique({
        where: { type: SettingType.LANGUAGE_PREFERRED },
    }))!.value

    console.log('pathname', request.nextUrl.pathname)

    // Check if there is any supported locale in the pathname
    const pathname = request.nextUrl.pathname
    const pathnameIsMissingLocale = locales.every(
        (locale) =>
            !pathname.startsWith(`/${locale.toLowerCase()}/`) && pathname !== `/${locale.toLowerCase()}`
    )

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        // e.g. incoming request is /products
        // The new URL is now /en-US/products
        return NextResponse.redirect(new URL(`/${preferred.toLowerCase()}/${pathname}`, request.url))
    }

    return NextResponse.next()
}

const except = ['api', 'admin', 'storage', '_next/static', '_next/image', 'robots.txt', 'sitemap.xml']

export const config = {
    matcher: [`/((?!${except.join('|')}).*)`],
}

export default middleware
