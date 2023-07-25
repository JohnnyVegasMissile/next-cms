import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const NotFoundEs = async () => <PagesDisplays.NotFound lang={CodeLanguage.ES} />

export const revalidate = Infinity

export default NotFoundEs
