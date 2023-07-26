import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const SlugENSide = async ({ params }: { params: { slug: string[] } }) => (
    <PagesDisplays.Page lang={CodeLanguage.EN} slug={params.slug} sidebar />
)

export default SlugENSide
