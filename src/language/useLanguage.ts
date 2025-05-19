import { useBoundStore } from "../store/useBoundStore"
import { languageStrings } from "./languageStrings"

export const useLanguage = () => {
    const config = useBoundStore((state: any) => state.config)
    const language: string = config?.language || 'en'

    switch (language) {
        case 'et':
            
            return languageStrings['et']
    
        default:

            return languageStrings['en']
    }

}

