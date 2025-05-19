import { supabase } from "../../helpers/supabase"


interface SignInCredentials {
    email: string;
    password: string;
}

export const signIn = async ({email,password}: SignInCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({email,password})
    return {data, error}
}