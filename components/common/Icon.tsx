import Link from "next/link";
import { type IconBaseProps, type IconType } from "react-icons";

interface IconProps extends IconBaseProps {
    icon: IconType
    linkUrl?: string
}


export function Icon({icon: IconElement, linkUrl, size, className, ...props}: IconProps) {
    const iconConfig = {
        size: 20,
        className: "text-zinc-600 hover:text-blue-600 transition-all ease-in-out duration-100"
    }
    
    const iconElement = <IconElement {...props} size={size ? size : iconConfig.size} className={className ? className : iconConfig.className}/>
    
    if(linkUrl) {
        return <Link href={linkUrl}>
            {iconElement}
        </Link>
    }

    return iconElement
}