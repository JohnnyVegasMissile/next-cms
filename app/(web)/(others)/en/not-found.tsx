import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const NotFoundEn = async () => <PagesDisplays.NotFound lang={CodeLanguage.EN} />

export const revalidate = Infinity

export default NotFoundEn
