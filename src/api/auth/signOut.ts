import { supabase } from "../../helpers/supabase"

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
}