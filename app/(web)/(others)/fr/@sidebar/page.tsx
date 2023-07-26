import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const HomeFRSide = async () => <PagesDisplays.Page lang={CodeLanguage.FR} slug={['fr']} sidebar />

export default HomeFRSide
