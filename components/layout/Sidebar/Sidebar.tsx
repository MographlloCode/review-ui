'use client'

import Image from "next/image";

import { useState } from "react";

import { BiChevronLeft, BiChevronRight, BiMedal, BiSolidExit, BiSolidUserCircle } from "react-icons/bi";

import { Button } from "../../common/Button";
import { Icon } from "../../common/Icon";
import { SidebarItemTitle } from "./SidebarItemTitle";
import { sidebarItems } from "./constants/sidebarItems";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarFooter } from "./SidebarFooter";

export function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const sidebarSize = sidebarOpen ? 'w-50' : 'w-14'

    return <nav className={`flex flex-col justify-between h-full ${sidebarSize} transition-all ease-in-out duration-500 gap-6`}>
        <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex flex-col grow">
            {sidebarItems.map(item => (
                <SidebarItemTitle
                    key={item.title}
                    text={item.title} 
                    link={item.link} 
                    icon={item.icon}
                    sidebarOpen={sidebarOpen} 
                    isHoverable 
                    size="sm" 
                />
            ))}
        </main>
        <SidebarFooter sidebarState={sidebarOpen} />
    </nav>
}