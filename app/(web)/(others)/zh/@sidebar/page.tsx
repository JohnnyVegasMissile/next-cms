import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const HomeZH = async () => <PagesDisplays.Page lang={CodeLanguage.ZH} sidebar />

export default HomeZH
