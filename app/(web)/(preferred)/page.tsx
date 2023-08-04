import { ResolvingMetadata } from 'next'
import { PagesDisplays, generateMetadata as getMetas } from '~/components/PagesDisplays'

export const generateMetadata = async ({ params }: { params: { slug: string } }, parent: ResolvingMetadata) =>
    getMetas(Array.isArray(params.slug) ? params.slug.join('/') : params.slug)

const HomePref = async () => <PagesDisplays.Page homepage />

export default HomePref
