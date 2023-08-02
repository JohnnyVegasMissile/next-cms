import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const NotFoundEN = async () => <PagesDisplays.NotFound lang={CodeLanguage.EN} />

export const revalidate = Infinity

export default NotFoundEN
