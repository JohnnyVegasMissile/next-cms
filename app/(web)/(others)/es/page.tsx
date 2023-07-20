import { CodeLanguage } from '@prisma/client'
import OthersPage from '../../OthersPage'

const HomeEs = async () => <OthersPage homepage lang={CodeLanguage.ES} slug={['es']} />

export const revalidate = Infinity

export default HomeEs
