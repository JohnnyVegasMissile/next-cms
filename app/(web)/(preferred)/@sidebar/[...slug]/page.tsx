import { Suspense } from 'react'
import { PagesDisplays } from '~/components/PagesDisplays'

const SlugPrefSide = async ({ params }: { params: { slug: string[] } }) => (
    <Suspense>
        <PagesDisplays.Page slug={params.slug} sidebar />
    </Suspense>
)

export default SlugPrefSide
