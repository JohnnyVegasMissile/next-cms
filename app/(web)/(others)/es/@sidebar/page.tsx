import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const HomeES = async () => <PagesDisplays.Page lang={CodeLanguage.ES} sidebar />

export default HomeES
