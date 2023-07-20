import OthersPage from '../../OthersPage'

const SlugPref = async ({ params }: { params: { slug: string[] } }) => <OthersPage slug={params.slug} />

export default SlugPref
