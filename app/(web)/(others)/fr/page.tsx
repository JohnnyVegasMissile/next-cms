import { CodeLanguage } from '@prisma/client'
import OthersPage from '../../OthersPage'

const HomeFr = async () => <OthersPage homepage lang={CodeLanguage.FR} slug={['fr']} />

export const revalidate = Infinity

export default HomeFr
