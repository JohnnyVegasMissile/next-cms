import { Suspense } from 'react'
import { PagesDisplays } from '~/components/PagesDisplays'

const SlugPref = async ({ params }: { params: { slug: string[] } }) => (
    <Suspense>
        <PagesDisplays.Page slug={params.slug} />
    </Suspense>
)

export default SlugPref
