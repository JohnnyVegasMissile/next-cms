import { CodeLanguage } from '@prisma/client'
import OthersPage from '../../OthersPage'

const HomeZh = async () => <OthersPage lang={CodeLanguage.ZH} slug={['zh']} />

export const revalidate = Infinity

export default HomeZh
