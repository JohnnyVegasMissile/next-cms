import { CodeLanguage } from '@prisma/client'
import OthersPage from '../../../OthersPage'

const SlugFr = async ({ params }: { params: { slug: string[] } }) => (
    <OthersPage lang={CodeLanguage.FR} slug={params.slug} />
)

export const revalidate = Infinity

export default SlugFr
