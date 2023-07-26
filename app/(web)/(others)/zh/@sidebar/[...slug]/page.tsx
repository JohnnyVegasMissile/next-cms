import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const SlugZHSide = async ({ params }: { params: { slug: string[] } }) => (
    <PagesDisplays.Page lang={CodeLanguage.ZH} slug={params.slug} sidebar />
)

export default SlugZHSide
