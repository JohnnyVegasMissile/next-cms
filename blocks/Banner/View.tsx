import styles from './Banner.module.css'

import type { Props } from '../types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import CustomImage from '@components/CustomImage'
import get from 'lodash.get'

const parseDefaultValue = (values: string) => {
    try {
        return JSON.parse(values)
    } catch (e) {
        return {}
    }
}

const View = ({ defaultValues /*, articles*/ }: Props) => {
    const { list } = parseDefaultValue(defaultValues)

    return (
        <section>
            <Swiper
                cssMode={true}
                // install Swiper modules
                modules={[Navigation]}
                // spaceBetween={50}
                // slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                autoplay
                loop
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
            >
                {list?.map((e: any, idx: number) => (
                    <SwiperSlide key={idx}>
                        <CustomImage.Background
                            img={get(e, 'img', undefined)}
                            className={styles.background}
                        >
                            <div className={styles.layer}>
                                <h1 className={styles.title}>{e.label}</h1>
                                {e.hasButton && (
                                    <button className={styles.button}>
                                        {e.button?.label}
                                    </button>
                                )}
                            </div>
                        </CustomImage.Background>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}

export default View
