import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const SlugFRSide = async ({ params }: { params: { slug: string[] } }) => (
    <PagesDisplays.Page lang={CodeLanguage.FR} slug={params.slug} sidebar />
)

export default SlugFRSide
