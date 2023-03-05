import { Login, PageType, PrismaClient, RightType, SettingType } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
    let superAdminId: number | undefined
    const superAdmins = await prisma.role.findMany({
        where: { superUser: true },
    })

    if (!superAdmins.length) {
        const newRole = await prisma.role.create({
            data: {
                superUser: true,
                name: 'Super Admin',
                // rights: {
                //     create: Object.keys(RightType).map((key) => ({ rightType: key as RightType })),
                // },
                rights: Object.keys(RightType).map((key) => key as RightType),
            },
        })

        superAdminId = newRole.id
    } else {
        superAdminId = superAdmins[0]?.id
    }

    const admins: Login[] = await prisma.login.findMany({
        where: { roleId: superAdminId },
    })

    if (!admins.length) {
        const hash = await bcrypt.hash('root', 10)

        await prisma.user.create({
            data: {
                name: 'root',
                login: {
                    create: {
                        roleId: superAdminId!,
                        email: 'root',
                        password: hash,
                    },
                },
            },
        })
    }

    const newSettings = [
        { type: SettingType.REVALIDATE_DELAY, value: '0' },
        { type: SettingType.APP_NAME, value: 'NextJS App' },
        { type: SettingType.BACKGROUND_COLOR, value: '#e9ecef' },
        { type: SettingType.PRIMARY_COLOR, value: '#ffc300' },
        { type: SettingType.SECONDARY_COLOR, value: '#003566' },
        { type: SettingType.PRIMARY_TEXT_COLOR, value: '#000814' },
        { type: SettingType.SECONDARY_TEXT_COLOR, value: '#001d3d' },
        { type: SettingType.DARK_COLOR, value: '#000814' },
        { type: SettingType.LIGHT_COLOR, value: '#e9ecef' },
        { type: SettingType.EXTRA_COLOR, value: '#ef476f' },
        { type: SettingType.MAIL_HOST, value: '' },
        { type: SettingType.MAIL_PORT, value: '', visible: false },
        { type: SettingType.MAIL_USER, value: '' },
        { type: SettingType.MAIL_PASS, value: '' },
        { type: SettingType.SIDEBAR_IS_ACTIVE, value: 'false' },
        { type: SettingType.SIDEBAR_WIDTH, value: '25' },
        { type: SettingType.SIDEBAR_UNIT, value: '%' },
        { type: SettingType.SIDEBAR_POSITION, value: 'left' },
        { type: SettingType.MAINTENANCE_MODE, value: 'false' },
    ]

    for (const { type, value, visible } of newSettings) {
        const setting = await prisma.setting.findUnique({
            where: { type },
        })

        if (!setting) {
            await prisma.setting.create({
                data: {
                    type,
                    value,
                    visible: visible,
                },
            })
        }
    }

    const newPage = [
        { name: 'Home', type: PageType.HOMEPAGE },
        { name: 'Sign in', type: PageType.SIGNIN },
        { name: 'Not found', type: PageType.NOTFOUND },
        { name: 'Error', type: PageType.ERROR },
        { name: 'Maintenance', type: PageType.MAINTENANCE },
    ]

    for (const { name, type } of newPage) {
        const pages = await prisma.page.findMany({
            where: { type },
        })

        if (!pages.length) {
            await prisma.page.create({
                data: {
                    name,
                    type,
                },
            })
        }
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
