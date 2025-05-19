import { supabase } from "../../helpers/supabase"

export const supabaseTestFunc = async () => {
    const { data, error } = await supabase.functions.invoke('otp-service', {
        body: 
        { 
            action: 'verify',
            otp: 550885,
            name:"Worked and go to sleep now"
        }
    })
    return { data , error }
}
