'use client'

import classNames from 'classnames'
import styles from './TextBlock.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import useSection from '~/hooks/useSection'
import { EditBlockProps } from '..'
import SectionWrap from '~/components/SectionWrap'
import MediaModal from '~/components/MediaModal'
import { MediaType, MenuChildType } from '@prisma/client'
import StyledInput from '~/components/StyledInput'
import { ContentType } from '.'

const Edit = ({ position }: EditBlockProps) => {
    const { errors, value, menus, addMenu } = useSection<ContentType>(position)
    const { menuId } = value || {}

    const menu = menus?.get(menuId || '')

    return (
        <section className={classNames(styles['section'])}>
            <ul>
                {menu?.childs.map((child) => {
                    switch (child.type) {
                        case MenuChildType.CONTENT:
                            return (
                                <li>
                                    {child.name}
                                    {/* {!!child.child.length && (
                                        <ul>
                                            {child.child.map((e) => (
                                                <li>{e.name}</li>
                                            ))}
                                        </ul>
                                    )} */}
                                </li>
                            )

                        case MenuChildType.LINK:
                            return <></>
                        case MenuChildType.TITLE:
                            return <></>
                    }
                })}
            </ul>
        </section>
    )
}

export default Edit
