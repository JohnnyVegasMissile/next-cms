import { PagesDisplays } from '~/components/PagesDisplays'

const NotFoundPref = async () => {
    return <PagesDisplays.NotFound />
}

export const revalidate = Infinity

export default NotFoundPref
