import { CodeLanguage } from '@prisma/client'
import OthersPage from '../../../OthersPage'

const SlugEs = async ({ params }: { params: { slug: string[] } }) => (
    <OthersPage lang={CodeLanguage.ES} slug={params.slug} />
)

export const revalidate = Infinity

export default SlugEs
