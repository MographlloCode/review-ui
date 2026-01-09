interface ContentWrapperProps {
    children: React.ReactNode
}

export function ContentWrapper({ children }: ContentWrapperProps) {
    return <div className="flex flex-col w-full h-full bg-gray-50 rounded-2xl border border-gray-300/50">{children}</div>
}