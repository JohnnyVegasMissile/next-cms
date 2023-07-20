import { CodeLanguage } from '@prisma/client'
import OthersPage from '../../../OthersPage'

const SlugEn = async ({ params }: { params: { slug: string[] } }) => (
    <OthersPage lang={CodeLanguage.EN} slug={params.slug} />
)

export const revalidate = Infinity

export default SlugEn
