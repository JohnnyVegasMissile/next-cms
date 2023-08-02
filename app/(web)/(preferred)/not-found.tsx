import { Suspense } from 'react'
import { PagesDisplays } from '~/components/PagesDisplays'

const NotFoundPref = async () => (
    <Suspense>
        <PagesDisplays.NotFound />
    </Suspense>
)

export const revalidate = Infinity

export default NotFoundPref
