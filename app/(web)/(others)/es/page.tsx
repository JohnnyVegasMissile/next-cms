import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const HomeEs = async () => <PagesDisplays.Page homepage lang={CodeLanguage.ES} />

export const revalidate = Infinity

export default HomeEs
