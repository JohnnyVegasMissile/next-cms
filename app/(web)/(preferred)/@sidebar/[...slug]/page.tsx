import { PagesDisplays } from '~/components/PagesDisplays'

const SlugPrefSide = async ({ params }: { params: { slug: string[] } }) => (
    <PagesDisplays.Page slug={params.slug} sidebar />
)

export default SlugPrefSide
