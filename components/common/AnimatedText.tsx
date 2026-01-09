'use client'

import { motion, AnimatePresence } from "motion/react"

interface AnimatedTextProps {
    text: string
    isHoverable?: boolean
    xsSize?: boolean
    smSize?: boolean
    mdSize?: boolean
    lgSize?: boolean
    xlSize?: boolean
    xxlSize?: boolean
}

export function AnimatedText({text, isHoverable, xsSize, smSize, mdSize, lgSize, xlSize, xxlSize}: AnimatedTextProps) {
    return <AnimatePresence>
        <motion.h1
            key="sidebar-title"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`
                ${xsSize && 'text-xs leading-3'}
                ${smSize && 'text-sm leading-4'}
                ${mdSize && 'text-base leading-5'}
                ${lgSize && 'text-lg leading-6'}
                ${xlSize && 'text-xl leading-6'}
                ${xxlSize && 'text-2xl leading-7'}
                ${isHoverable && "group-hover:text-blue-600"} 
                text-zinc-600 whitespace-nowrap
            `}
        >
            {text}
        </motion.h1>
    </AnimatePresence>
}