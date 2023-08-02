import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const HomeFR = async () => <PagesDisplays.Page lang={CodeLanguage.FR} sidebar />

export default HomeFR
