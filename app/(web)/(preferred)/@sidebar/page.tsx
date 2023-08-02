import { Suspense } from 'react'
import { PagesDisplays } from '~/components/PagesDisplays'

const HomePrefSide = async () => (
    <Suspense>
        <PagesDisplays.Page homepage sidebar />
    </Suspense>
)

export default HomePrefSide
