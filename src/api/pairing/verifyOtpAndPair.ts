import { supabase } from "../../helpers/supabase"
import { useBoundStore } from "../../store/useBoundStore"


export const verifyOtpAndPair = async ({otp}: {otp: number}) => {
    const { data, error } = await supabase.functions.invoke('otp-service', {
        body: 
        { 
            action: 'verify',
            otp,
        }
    })
    console.log(JSON.stringify({ data, error }))
    if (!error) {
        useBoundStore.setState({ pairingId: data?.pairingId })
    }
    

    return { error }
}
