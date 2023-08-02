import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const NotFoundES = async () => <PagesDisplays.NotFound lang={CodeLanguage.ES} />

export const revalidate = Infinity

export default NotFoundES
