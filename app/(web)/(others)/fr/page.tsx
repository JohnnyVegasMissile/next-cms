import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const HomeFr = async () => <PagesDisplays.Page homepage lang={CodeLanguage.FR} />

export const revalidate = Infinity

export default HomeFr
