import styles from './Banner.module.css'

import type { Props } from '../types'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'

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
                <SwiperSlide>
                    <div className={styles.background}>
                        <div className={styles.layer}>
                            <h1 className={styles.title}>This is a very important title</h1>
                            <button className={styles.button}>Click me</button>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className={styles.background}>
                        <div className={styles.layer}>
                            <h1 className={styles.title}>This is a very important title</h1>
                            <button className={styles.button}>Click me</button>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    )
}

export default View
