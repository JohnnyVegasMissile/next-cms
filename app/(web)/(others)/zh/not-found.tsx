import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const NotFoundZh = async () => <PagesDisplays.NotFound lang={CodeLanguage.ZH} />

export const revalidate = Infinity

export default NotFoundZh
