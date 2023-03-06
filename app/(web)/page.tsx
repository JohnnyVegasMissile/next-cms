import { PageType } from '@prisma/client'
import TextBlock from '~/blocks/TextBlock'
import ImageBlock from '~/blocks/ImageBlock'
import QuickEditButton from '~/components/QuickEditButton'
import { prisma } from '~/utilities/prisma'

const getProps = async () => {
    return await prisma.page.findFirst({
        where: { type: PageType.HOMEPAGE },
    })
}

const imageSrc =
    'https://images.unsplash.com/photo-1677763472056-52de795aabd4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80'

const Home = async () => {
    const page = await getProps()

    return (
        <>
            <QuickEditButton />
            <div>
                pageh: {page?.name}
                <TextBlock
                    content={{
                        title: 'Title',
                        subtitle: '',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum <strong>dolore eu fugiat nulla pariatur.</strong> Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    }}
                />
                <TextBlock
                    content={{
                        title: 'Title',
                        subtitle: 'Subtitle',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum <strong>dolore eu fugiat nulla pariatur.</strong> Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                        buttons: [{ label: 'Button', link: 'www.google.com' }],
                    }}
                />
                <TextBlock
                    content={{
                        title: 'Title',
                        subtitle: 'Subtitle',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum <strong>dolore eu fugiat nulla pariatur.</strong> Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                        image: imageSrc,
                        switched: true,
                    }}
                />
                <ImageBlock
                    content={{
                        title: 'Title',
                        image: imageSrc,
                        button: { label: 'Button', link: 'www.google.com' },
                    }}
                />
            </div>
        </>
    )
}

const Sidebar = async () => {
    const page = await getProps()

    return <div>Sidebar: {page?.name}</div>
}

Home.sidebar = Sidebar

export const revalidate = 'force-cache'
export default Home
