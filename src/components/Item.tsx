import React, { ReactNode } from "react"
import classnames from 'classnames';
interface Props {

    icon: ReactNode,
    title: string,
    classNameContainer?: string,
    classIcon?: string,
    classTitle?: string,
}

const Item = ({ classNameContainer = "flex justify-center items-center", classIcon, classTitle, icon, title }: Props) => {
    return (

        <div className={classNameContainer}>
            <div className={classnames(classIcon)} >{icon}</div>
            <div className={classnames(classTitle)}>{title}</div>
        </div>

    )
};

export default Item;
