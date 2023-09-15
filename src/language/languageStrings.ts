
export interface Language {
    _meta: string;
    get_started: string;
    pair_to_pos: string;
    pos_explanation: string;
    verify_code: string;
    need_help: string;
    verifying: string;
    otp_failed: string;
    otp_help: string;
    otp_help_msg: string;
    start_payment: string;
    login_failed: string;
    login_failed_msg: string;
    device_offline: string;
    device_offline_msg: string;
    battery_low: string;
}

interface Languages {
    en: Language;
    et: Language
}

export const languageStrings: Languages = {
    en: {
        _meta: 'en',
        get_started: 'Get started',
        pair_to_pos: 'Pair to POS',
        pos_explanation: 'Enter the verification code to connect your terminal to the POS app.',
        verify_code: 'Verify code',
        need_help: 'Need help?',
        verifying: 'Verifying...',
        otp_failed: 'OTP verification failed',
        otp_help: 'Terminal pairing',
        otp_help_msg: 'Use the one-time code generated in the Checkout App to pair your terminal. Please refer to the documentation for more details.',
        start_payment: 'START PAYMENT',
        login_failed: 'Login failed',
        login_failed_msg: 'Please restart the device by holding down the power button and selecting "Restart".\n\nContact Kassandra Support if restarting does not resolve the issue.',
        device_offline: 'Device is offline',
        device_offline_msg: 'Please connect the device to a Wifi network to accept payments.',
        battery_low: 'BATTERY LOW'

    },

    et: {
        _meta: 'et',
        get_started: 'Alusta',
        pair_to_pos: 'Ühenda Kassaga',
        pos_explanation: 'Sisesta ühekordne kood et ühendada terminal kassarakendusega.',
        verify_code: 'Saada kood',
        need_help: 'Vajad abi?',
        verifying: 'Ühilduse loomine...',
        otp_failed: 'Ühildamine ebaõnnestus',
        otp_help: 'Terminali ühildamine',
        otp_help_msg: 'Kasuta kassarakenduses loodud ühekordset koodi, et ühendada terminal ja vastu võtta makseid. Palun konsulteerige dokumentatsiooni lisainfo jaoks.',
        start_payment: 'ALUSTA MAKSET',
        login_failed: 'Sisselogimine ebaõnnestus',
        login_failed_msg: 'Taaskäivita seade hoides all toitenuppu ja valides ette tulevast menüüst "Restart".\n\nKontakteeruge Kassandra Kasutajatoega kui probleem ei lahene peale taaskäivitust.',
        device_offline: 'Seade on võrguühenduseta',
        device_offline_msg: 'Siduge seade Wifi-võrguga, et makseid vastu võtta.',
        battery_low: 'AKU SAAB VARSTI TÜHJAKS'



    }

}
