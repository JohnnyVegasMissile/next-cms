import { Login, PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import get from 'lodash.get'
const prisma = new PrismaClient()

async function main() {
    const defaultContainer = await prisma.container.findUnique({
        where: { id: 'page' },
        include: { slug: true },
    })

    let parentId = get(defaultContainer, 'slug.0.id', undefined)

    if (!defaultContainer) {
        const newDefaultContainer = await prisma.container.create({
            data: {
                id: 'page',
                title: 'Default Page',
                contentHasSections: false,
                published: true,
                slug: {
                    create: {
                        fullSlug: '',
                        slug: '',
                    },
                },
            },
            include: { slug: true },
        })

        parentId = get(newDefaultContainer, 'slug.0.id', undefined)
    }

    const notfound = await prisma.content.findUnique({
        where: { id: 'notfound' },
    })

    if (!notfound) {
        await prisma.content.create({
            data: {
                id: 'notfound',
                title: 'Not Found',
                containerId: 'page',
                published: true,
                slug: {
                    create: {
                        fullSlug: 'not-found',
                        slug: 'not-found',
                        parentId,
                    },
                },
            },
        })
    }

    const signin = await prisma.content.findUnique({
        where: { id: 'signin' },
    })

    if (!signin) {
        await prisma.content.create({
            data: {
                id: 'signin',
                title: 'Sign In',
                containerId: 'page',
                published: true,
                slug: {
                    create: {
                        fullSlug: 'sign-in',
                        slug: 'sign-in',
                        parentId,
                    },
                },
            },
        })
    }

    const superAdminType: Role[] = await prisma.role.findMany({
        where: { id: 'super-admin' },
    })

    if (!superAdminType.length) {
        await prisma.role.create({
            data: {
                id: 'super-admin',
                name: 'Super Admin',
            },
        })
    }

    const adminType: Role[] = await prisma.role.findMany({
        where: { id: 'admin' },
    })

    if (!adminType.length) {
        await prisma.role.create({
            data: {
                id: 'admin',
                name: 'Admin',
            },
        })
    }

    const userType: Role[] = await prisma.role.findMany({
        where: { id: 'user' },
    })

    if (!userType.length) {
        await prisma.role.create({
            data: {
                id: 'user',
                name: 'User',
            },
        })
    }

    const admins: Login[] = await prisma.login.findMany({
        where: { roleId: 'super-admin' },
    })

    if (!admins.length) {
        const hash = await bcrypt.hash('root', 10)

        await prisma.user.create({
            data: {
                name: 'root',
                login: {
                    create: {
                        roleId: 'super-admin',
                        email: 'root',
                        password: hash,
                    },
                },
            },
        })
    }

    const revalidate = await prisma.setting.findUnique({
        where: { name: 'revalidate' },
    })

    if (!revalidate) {
        await prisma.setting.create({
            data: {
                name: 'revalidate',
                value: '86400',
            },
        })
    }

    const appname = await prisma.setting.findUnique({
        where: { name: 'app_name' },
    })

    if (!appname) {
        await prisma.setting.create({
            data: {
                name: 'app_name',
                value: 'NextJS App',
            },
        })
    }

    const bgcolor = await prisma.setting.findUnique({
        where: { name: 'background_color' },
    })

    if (!bgcolor) {
        await prisma.setting.create({
            data: {
                name: 'background_color',
                value: '#f0f2f5',
            },
        })
    }

    const primarycolor = await prisma.setting.findUnique({
        where: { name: 'primary_color' },
    })

    if (!primarycolor) {
        await prisma.setting.create({
            data: {
                name: 'primary_color',
                value: '#2196F3',
            },
        })
    }

    const secondarycolor = await prisma.setting.findUnique({
        where: { name: 'secondary_color' },
    })

    if (!secondarycolor) {
        await prisma.setting.create({
            data: {
                name: 'secondary_color',
                value: '#FF9800',
            },
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
