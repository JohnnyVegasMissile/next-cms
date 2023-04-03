import { PageType, PrismaClient, SettingType } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
    const root = await prisma.login.findFirst({
        where: { root: true },
    })

    if (!root) {
        const hash = await bcrypt.hash(process.env['ROOT_USER_PASS'] || 'root', 10)

        await prisma.user.create({
            data: {
                name: process.env['ROOT_USER_NAME'] || 'root',
                login: {
                    create: {
                        root: true,
                        email: process.env['ROOT_USER_MAIL'] || 'root',
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
        { type: SettingType.SIDEBAR_COLOR, value: '#ef476f' },
        { type: SettingType.SIDEBAR_BREAKPOINT_SIZE, value: 'medium' },
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
