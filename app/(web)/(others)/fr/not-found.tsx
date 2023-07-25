import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const NotFoundFr = async () => <PagesDisplays.NotFound lang={CodeLanguage.FR} />

export const revalidate = Infinity

export default NotFoundFr
