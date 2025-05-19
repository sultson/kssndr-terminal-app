import { useBoundStore } from "../store/useBoundStore"

const SIZE: any = {
    'small': 0.75,
    'medium': 1,
    'large': 1.25,
    'null': 1,
    'undefined': 1
}

export const useTheme = () => {
    const config = useBoundStore((state: any) => state.config)
    const colors = {
        accent: config?.appearance?.accentColor || '#3F80FF',
        background:  config?.appearance?.customBackgroundColor ?  config?.appearance?.customBackgroundColor :  config?.appearance?.theme === 'light' ? 'white' : 'black',
        text: config?.appearance?.theme === 'light' ? '#000000' : '#ffffff',
        secondary: config?.appearance?.secondary || '#808080'
    }

    const theme = {
        colors,
        borderRadius: config?.appearance?.borderRadius || 0,
        sizeMultiplier: SIZE[String(config?.appearance?.size)],
        logo:  config?.appearance?.logoUrl ? {uri: config?.appearance?.logoUrl} : null,
        theme: config?.appearance?.theme

    }

    return theme
}