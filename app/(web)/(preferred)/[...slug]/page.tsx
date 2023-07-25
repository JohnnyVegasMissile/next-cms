import { PagesDisplays } from '~/components/PagesDisplays'

const SlugPref = async ({ params }: { params: { slug: string[] } }) => (
    <PagesDisplays.Page slug={params.slug} />
)

export default SlugPref
