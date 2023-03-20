import Banner from './Banner'
import TilesGrid from './TilesGrid'
import ImagesGrid from './ImagesGrid'
import Timelines from './Timelines'
import TilesCarousel from './TilesCarousel'
import IconsGrid from './IconsGrid'
import Form from './Form'

// https://dribbble.com/shots/14943796-Personal-portfolio-website

// https://www.behance.net/gallery/141518055/Portfolio-Website-Design?tracking_source=search_projects%7Cdeveloper+portfolio

const Integration = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Banner />
            <TilesGrid />
            <ImagesGrid />
            <Timelines />
            <TilesCarousel />
            <IconsGrid />
            <Form />
        </div>
    )
}

export const revalidate = 'force-cache'
export default Integration
