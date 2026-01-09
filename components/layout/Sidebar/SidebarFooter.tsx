import { BiSolidExit, BiSolidUserCircle } from "react-icons/bi";
import { Icon } from "@/components/common/Icon";
import { SidebarItemTitle } from "./SidebarItemTitle";
import { Button } from "@/components/common/Button";

interface SidebarFooterProps {
    sidebarState: boolean
}

export function SidebarFooter({ sidebarState }: SidebarFooterProps) {
    return <footer className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-0.5">
            <Icon icon={BiSolidUserCircle} size={32} className="text-zinc-700" />
            <div className="flex flex-col">
                <span className="font-semibold">
                    <SidebarItemTitle text="Gustavo M." sidebarOpen={sidebarState} size="sm" />
                </span>
                <SidebarItemTitle text="Reviewer" sidebarOpen={sidebarState} size="xs" />
            </div>
        </div>
        <Button onClick={() => console.log("Click para logout")}>
            <Icon icon={BiSolidExit} size={18} />
        </Button>
    </footer>
}