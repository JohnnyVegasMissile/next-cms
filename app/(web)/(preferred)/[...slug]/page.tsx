import { PagesDisplays, generateMetadata as getMetas } from '~/components/PagesDisplays'

export const generateMetadata = async ({ params }: { params: { slug: string } }) =>
    getMetas(Array.isArray(params.slug) ? params.slug.join('/') : params.slug)

const SlugPref = async ({ params }: { params: { slug: string[] } }) => (
    <PagesDisplays.Page slug={params.slug} />
)

export default SlugPref
