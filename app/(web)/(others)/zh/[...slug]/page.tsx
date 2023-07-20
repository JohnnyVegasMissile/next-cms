import { CodeLanguage } from '@prisma/client'
import OthersPage from '../../../OthersPage'

const SlugZh = async ({ params }: { params: { slug: string[] } }) => (
    <OthersPage lang={CodeLanguage.ZH} slug={params.slug} />
)

export const revalidate = Infinity

export default SlugZh
