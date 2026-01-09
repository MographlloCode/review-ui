interface ToolTipProps {
    title: string
}

export function Tooltip({title}: ToolTipProps) {
    return <div className="
            invisible opacity-0 group-hover:visible group-hover:opacity-100
            transition-opacity duration-200
            left-10 ml-2 text-sm text-zinc-700 
            tracking-wide bg-gray-200 
            rounded-md fixed px-3 py-1 text-center 
            shadow-2xl capitalize z-50 whitespace-nowrap
            pointer-events-none
        ">
        {title}
    </div>
}