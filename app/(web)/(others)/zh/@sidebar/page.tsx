import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const HomeZHSide = async () => <PagesDisplays.Page lang={CodeLanguage.ZH} slug={['zh']} sidebar />

export default HomeZHSide
