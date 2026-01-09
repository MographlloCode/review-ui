import { type IconType } from "react-icons"
import { Icon } from "@/components/common/Icon"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { Tooltip } from "@/components/common/Tooltip"
import { AnimatedText } from "@/components/common/AnimatedText"

interface SidebarItemTitleProps {
    id?: string
    text: string
    size?: string
    link?: string
    icon?: IconType
    sidebarOpen: boolean
    isHoverable?: boolean
}

const animatedTextWithSize = (size = 'md', text: string) => {
    switch (size) {
        case 'xs':
            return <AnimatedText text={text} xsSize />
        case 'sm':
            return <AnimatedText text={text} smSize />
        case 'md':
            return <AnimatedText text={text} mdSize />
        case 'lg':
            return <AnimatedText text={text} lgSize />
        case 'xl':
            return <AnimatedText text={text} xlSize />
        case 'xxl':
            return <AnimatedText text={text} xxlSize />
        default:
            return <AnimatedText text={text} mdSize />
    }
}

export function SidebarItemTitle({id, text, size, link = '/', icon, sidebarOpen, isHoverable}: SidebarItemTitleProps) {
    return <Link href={link} className="relative flex items-center group" id={id}>
            {!sidebarOpen && <Tooltip title={text} />}
            {icon && <Icon icon={icon} size={22} className={`ps-1 min-w-8 text-zinc-600 ${isHoverable && "hover:text-blue-600"} transition-all ease-in-out duration-100`} />}
            {sidebarOpen && (
                animatedTextWithSize(size, text)
            )}
        </Link>
}