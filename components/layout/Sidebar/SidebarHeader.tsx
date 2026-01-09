import Image from "next/image";
import { SidebarItemTitle } from "./SidebarItemTitle";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { useState } from "react";

interface SidebarHeaderProps {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
}

export function SidebarHeader({sidebarOpen, setSidebarOpen}: SidebarHeaderProps) {
    return <header className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
            <Image alt="Dell Technologies" src='/dell_logo.svg' width={124} height={124} className="min-w-10 w-10" />
            <div className="flex flex-col font-semibold">
                <SidebarItemTitle text="Classification" sidebarOpen={sidebarOpen} size="sm"/>
                <SidebarItemTitle text="Curation" sidebarOpen={sidebarOpen} size="sm"/>
            </div>
        </div>
        <Button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Icon icon={sidebarOpen ? BiChevronLeft : BiChevronRight} size={24} />
        </Button>
    </header>
}