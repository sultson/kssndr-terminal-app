package com.kassandra.terminal

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.verifone.payment_sdk.*
import kotlin.math.pow

class PsdkModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "PsdkModule"
    private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    val kssndrPsdkConfig: MutableMap<String, Boolean> = mutableMapOf(Pair("sendReceiptsOnPaymentCompleted", true))

    private var listenerCount = 0
    private val TAG:String = "kssndr:PsdkModule"
    private var mContext:Context? = null
    // Defined amount totals, required if need to implement an item
    // basket and add items to it
    private var mAmountTotals:AmountTotals? = null

    // A payment SDK object. This is a main object which is used
    // for initialization
    private var mPsdk:PaymentSdk? = null
    private var mPayment:Payment? = null
    private var mAppSpecificData:String? = String()

    fun convertDecimalBaseToDouble(decimalBase: Decimal?): Double {
        return if (decimalBase?.value != null && decimalBase?.scale != null) {
            decimalBase?.value / 10.0.pow(decimalBase?.scale.toDouble())

        } else {
            0.0
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        if (listenerCount == 0) {
            // Set up any upstream listeners or background tasks as necessary
        }

        listenerCount += 1
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        listenerCount -= count
        if (listenerCount == 0) {
            // Remove upstream listeners, stop unnecessary background tasks
        }
    }

    @ReactMethod
    fun psdkInit(promise: Promise) {
        try {
            Log.i(TAG, "In psdkInit")
            mContext = reactApplicationContext
            val thread =  object : Thread() {
                override fun run() {
                    val param:HashMap<String, String> = hashMapOf(
                        PsdkDeviceInformation.DEVICE_CONNECTION_TYPE_KEY to "tcpip",
                        PsdkDeviceInformation.DEVICE_ADDRESS_KEY to "127.0.0.1"
                    )
                    mPsdk = PaymentSdk.create(mContext!!)
                    mPsdk?.initializeFromValues(mCommerceListener, param)
                }
            }
            thread.run()
            promise.resolve(null)
        } catch(e : Exception) {
            promise.reject("psdkInit Error", e)
        }

    }

    @ReactMethod
    fun psdkLogin(promise: Promise) {
        try {
            Log.i(TAG, "In psdkLogin")
            val credentials = LoginCredentials.createWith2("username", null, null, "0")
            mPsdk?.transactionManager?.loginWithCredentials(credentials)
            promise.resolve(null)
        } catch(e : Exception) {
            promise.reject("psdkLogin Error", e)
        }
    }

    @ReactMethod
    fun psdkLogout(promise: Promise) {
        try {
            Log.i(TAG, "In psdkLogout")
            mPsdk?.transactionManager?.logout()
            promise.resolve(null)
        } catch(e : Exception) {
            promise.reject("psdkLogout Error", e)
        }
    }

    @ReactMethod
    fun psdkStartSession(promise: Promise) {
        try {
            Log.i(TAG, "In psdkStartSession")
            mPsdk?.transactionManager?.startSession2(Transaction.create())
            promise.resolve(null)
        } catch(e : Exception) {
            promise.reject("psdkStartSession Error", e)
        }
    }

    @ReactMethod
    fun psdkEndSession(promise: Promise) {
        try {
            Log.i(TAG, "In psdkEndSession")
            mPsdk?.transactionManager?.endSession()
            promise.resolve(null)
        } catch(e : Exception) {
            promise.reject("psdkEndSession Error", e)
        }
    }

    @ReactMethod
    fun psdkSale(total: Double, sendReceiptsOnPaymentCompleted: Boolean, promise: Promise) {
        try {
            Log.i(TAG, "In psdkSale")
            kssndrPsdkConfig["sendReceiptsOnPaymentCompleted"] = sendReceiptsOnPaymentCompleted
            val payment = Payment.create()
            val mAmountTotals = AmountTotals.create(false)
            val tip = 0.00
            mAmountTotals?.subtotal = Decimal(total * 0.8)
            mAmountTotals?.tax = Decimal(total * 0.2)
            mAmountTotals?.total = Decimal(total)
            mAmountTotals?.gratuity = Decimal(tip)
            payment.requestedAmounts = mAmountTotals
            mPsdk?.transactionManager?.startPayment(payment)
            promise.resolve(null)
        } catch(e : Exception) {
            promise.reject("psdkSale Error", e)
        }
    }

    @ReactMethod
    fun psdkVoid(total: Double, promise: Promise) {
        try {
            Log.i(TAG, "In psdkVoid")
            val payment = Payment.create()
            payment.appSpecificData = mAppSpecificData
            mPsdk?.transactionManager?.processVoid(payment)
            promise.resolve(null)
        } catch(e : Exception) {
            promise.reject("psdkVoid Error", e)
        }
    }

    @ReactMethod
    fun psdkTearDown(promise: Promise) {
        try {
            Log.i(TAG, "In psdkTearDown")
            mPsdk?.tearDown()
            promise.resolve(null)
        } catch(e : Exception) {
            promise.reject("psdkTearDown Error", e)
        }
    }

    @ReactMethod
    fun psdkQueryLastTransaction(promise: Promise) {
        try {
            Log.i(TAG, "In psdkQueryLastTransaction")
            var transactionQuery = TransactionQuery.create()
            transactionQuery.isQueryingLastTransaction = true
            promise.resolve(null)
        } catch(e : Exception) {
            promise.reject("psdkQueryLastTransaction Error", e)
        }
    }

    @ReactMethod
    fun getPsdkDeviceInformation(promise: Promise) {
        try {
            Log.i(TAG, "In getPsdkVersion")
            val params = Arguments.createMap().apply {
                putString("paymentAppVersion", mPsdk?.deviceInformation?.paymentAppVersion.toString());
                putString("logicalDeviceId", mPsdk?.deviceInformation?.logicalDeviceId.toString());
                putString("paymentDeviceState", mPsdk?.deviceInformation?.state.toString());
            }
            promise.resolve(params)
        } catch(e : Exception) {
            promise.reject("psdkStartSession Error", e)
        }
    }

    @ReactMethod
    fun requestDeviceVitals(promise: Promise) {
        try {
            Log.i(TAG, "In requestDeviceVitals")
            mPsdk?.transactionManager?.requestDeviceVitals()
            promise.resolve(null)
        } catch(e : Exception) {
            promise.reject("requestDeviceVitals Error", e)
        }
    }


    private val mCommerceListener = object : CommerceListener2(){
        private val TAG:String = "k:CommerceListener2"

        override fun handleDeviceVitalsInformationEvent(p0: DeviceVitalsInformationEvent?) {
            Log.i(TAG, "handleDeviceVitalsInformationEvent: " + p0?.message)
            val dv = p0?.deviceVitals
            val data = Arguments.createMap().apply {
                putString("deviceVitals", dv.toString())
            }
            val params = Arguments.createMap().apply {
                putString("status", p0?.status.toString());
                putString("message", p0?.message)
                putString("type", p0?.type);
                putString("eventCategory", "DeviceVitals");
                putMap("data", data);
            }

            sendEvent(reactContext, "CommerceListenerEvent", params)
        }

        override fun handlePinEvent(p0: PinEvent?) {
            Log.i(TAG, "handlePinEvent: " + p0?.message)
        }

        override fun handleCommerceEvent(p0: CommerceEvent?) {
            Log.i(TAG, "In handleCommerceEvent " + p0?.message)
        }

        override fun handleTransactionEvent(p0: TransactionEvent?) {
            Log.i(TAG, "In handleTransactionEvent " + p0?.message)

            val params = Arguments.createMap().apply {
                putString("status", p0?.status.toString());
                putString("message", p0?.message);
                putString("type", p0?.type);
                putString("eventCategory", "Transaction");
            }

            sendEvent(reactContext, "CommerceListenerEvent", params)

            if(p0?.type?.equals(TransactionEvent.LOGIN_COMPLETED, true) == true){
                if(p0?.status == StatusCode.SUCCESS){
                    Log.i(TAG, "Login Success")
                }
                else
                {
                    Log.i(TAG, "Login Failure")
                }
            }

            if(p0?.type?.equals(CommerceEvent.SESSION_STARTED, true) == true)
            {
                if(p0?.status == StatusCode.SUCCESS){
                    Log.i(TAG, "Sesssion Start Success")
                }
                else
                {
                    Log.i(TAG, "Session Start Failed")
                }
            }

            if(p0?.type?.equals(CommerceEvent.SESSION_ENDED, true) == true)
            {
                Log.i(TAG, "Session Ended Success")
            }

            if(p0?.type?.equals(TransactionEvent.TRANSACTION_NOTIFICATION, true) == true)
            {
                Log.i(
                    TAG, "Transaction Notification " +
                            p0?.message
                )
            }

        }

        override fun handleAmountAdjustedEvent(p0: AmountAdjustedEvent?) {
            Log.i(TAG, "In handleAmountAdjustedEvent " + p0?.message)
            mPsdk?.transactionManager?.sendEventResponse(AmountAdjustedEventResponse.asCommerceResponse(
                p0?.generateAmountAdjustedEventResponse()
            ))
        }

        override fun handleBasketAdjustedEvent(p0: BasketAdjustedEvent?) {
            Log.i(TAG, "In handleBasketAdjustedEvent " + p0?.message)
        }

        override fun handleBasketEvent(p0: BasketEvent?) {
            Log.i(TAG, "In handleBasketEvent " + p0?.message)
        }

        override fun handleCardInformationReceivedEvent(p0: CardInformationReceivedEvent?) {
            Log.i(TAG, "In handleCardInformationReceivedEvent " + p0?.message)
        }

        override fun handleDeviceManagementEvent(p0: DeviceManagementEvent?) {
            Log.i(TAG, "In handleDeviceManagementEvent " + p0?.message)
        }

        override fun handleLoyaltyReceivedEvent(p0: LoyaltyReceivedEvent?) {
            Log.i(TAG, "In handleLoyaltyReceivedEvent " + p0?.message)
        }

        override fun handlePaymentCompletedEvent(p0: PaymentCompletedEvent?) {
            val paymentResult = p0?.payment
            val cardInfo = p0?.payment?.cardInformation
            val status = p0?.status
            if (status == StatusCode.SUCCESS) {
                //socketEventEmitHandler.sendResponse("PAYMENT", "PAYMENT_COMPLETED_EVENT", "SUCCESS")
                Log.i(TAG, "Payment success")
            }

            Log.i(TAG, "In handlePaymentCompletedEvent " + p0?.message + " : " +  p0?.status + p0?.type)
            mPayment = paymentResult
            mAppSpecificData = paymentResult?.appSpecificData

            val receipts = mPayment?.receipts

            val emvTags = cardInfo?.emvTags
            val aid = emvTags?.get("9F06") ?: ""
            val paymentAmount  = mPayment?.paymentAmount
            val subtotal = mPayment?.amounts?.subtotal
            val total = mPayment?.amounts?.total
            val tax = mPayment?.amounts?.tax
            val fees = mPayment?.amounts?.fees
            val gratuity = mPayment?.amounts?.gratuity
            val receiptsMap = Arguments.createMap()
            if (kssndrPsdkConfig["sendReceiptsOnPaymentCompleted"] == true) {
                val customerReceipt = receipts?.get(ReceiptType.CUSTOMER)?.asHtml
                val merchantReceipt = receipts?.get(ReceiptType.MERCHANT)?.asHtml
                receiptsMap.putString("customer", customerReceipt)
                receiptsMap.putString("merchant", merchantReceipt)

            }

            val amountTotalsMap = Arguments.createMap().apply {
                putDouble("subtotal", convertDecimalBaseToDouble(subtotal))
                putDouble("total", convertDecimalBaseToDouble(total))
                putDouble("tax", convertDecimalBaseToDouble(tax))
                putDouble("fees", convertDecimalBaseToDouble(fees))
                putDouble("gratuity", convertDecimalBaseToDouble(gratuity))

            }
            val cardInfoMap = Arguments.createMap().apply {
                putString("aid", aid)
                putString("presentationMethod", cardInfo?.presentationMethod.toString())
                putString("paymentBrand", cardInfo?.paymentBrand.toString())
                putString("cardStatus", cardInfo?.cardStatus.toString())
                //putString("accountType", cardInfo?.accountType.toString());
                //putString("cardToken", cardInfo?.cardToken.toString());
                //putString("accountReference", cardInfo?.accountReference.toString());
                //putString("cardPan", cardInfo?.cardPan.toString());
                putString("cardPanLast4", cardInfo?.panLast4.toString())
                putString("cardCountry", cardInfo?.cardCountry.toString())
                putString("cardToken", cardInfo?.cardToken.toString())

            }

            val paymentMap = Arguments.createMap().apply {
                putMap("cardInfo", cardInfoMap)
                putMap("amountTotals", amountTotalsMap)
                //putString("appSpecificData", mAppSpecificData);
                putString("paymentId", mPayment?.paymentId)
                //putString("paymentMethod", mPayment?.paymentMethod);
                putString("localPaymentId", mPayment?.localPaymentId)
                putDouble("paymentAmount", convertDecimalBaseToDouble(paymentAmount))
                putString("terminalId", mPayment?.terminalId)
                putString("authCode", mPayment?.authCode)
                //putString("hostAuthCode", mPayment?.hostAuthCode);
                putString("invoice", mPayment?.invoice)
                //putString("acquirerId", mPayment?.acquirerId);
                putString("terminalTimestamp", mPayment?.timestamp)
                putString("merchantId", mPayment?.merchantId)
                putString("ptid", mPsdk?.deviceInformation?.logicalDeviceId.toString())

            }
            val data = Arguments.createMap().apply {
                putMap("payment", paymentMap)
                putMap("receipts", receiptsMap)
            }
            val params = Arguments.createMap().apply {
                putString("status", p0?.status.toString())
                putString("message", p0?.message)
                putString("type", p0?.type)
                putString("eventCategory", "PaymentCompleted")
                putMap("data", data)
            }

            sendEvent(reactContext, "CommerceListenerEvent", params)
        }

        override fun handleReceiptDeliveryMethodEvent(p0: ReceiptDeliveryMethodEvent?) {
            Log.i(TAG, "In handleReceiptDeliveryMethodEvent " + p0?.message)
        }

        override fun handleStoredValueCardEvent(p0: StoredValueCardEvent?) {
            Log.i(TAG, "In handleStoredValueCardEvent " + p0?.message)
        }

        override fun handleUserInputEvent(p0: UserInputEvent?) {
            Log.i(TAG, "In handleUserInputEvent " + p0?.message)
        }

        override fun handleReconciliationEvent(p0: ReconciliationEvent?) {
            Log.i(TAG, "In handleReconciliationEvent " + p0?.message)
        }

        override fun handleReconciliationsListEvent(p0: ReconciliationsListEvent?) {
            Log.i(TAG, "In handleReconciliationsListEvent " + p0?.message)
        }

        override fun handleTransactionQueryEvent(p0: TransactionQueryEvent?) {
            Log.i(TAG, "In handleTransactionQueryEvent " + p0?.message)
            if(p0?.foundPayments() == true && p0?.payments.size > 0) {
                val payments = p0?.payments
                try{
//                    for (p in payments) {
//
//                        Log.i(TAG, "Payment Details : " + "\n" +
//                                "Payment ID : " + p.paymentId + "\n" +
//                                "Auth Code : " + p.authCode + "\n" +
//                                "Invoice : " + p.invoice )
//
//                    }
                    var lastPayment = payments[0]
                    var cardInfo = lastPayment.cardInformation
                    val receipts = lastPayment?.receipts

                    val emvTags = cardInfo?.emvTags
                    val aid = emvTags?.get("9F06") ?: ""
                    val paymentAmount  = mPayment?.paymentAmount
                    val subtotal = lastPayment?.amounts?.subtotal
                    val total = lastPayment?.amounts?.total
                    val tax = lastPayment?.amounts?.tax
                    val fees = lastPayment?.amounts?.fees
                    val gratuity = lastPayment?.amounts?.gratuity
                    val receiptsMap = Arguments.createMap()
                    if (kssndrPsdkConfig["sendReceiptsOnPaymentCompleted"] == true) {
                        val customerReceipt = receipts?.get(ReceiptType.CUSTOMER)?.asHtml
                        val merchantReceipt = receipts?.get(ReceiptType.MERCHANT)?.asHtml
                        receiptsMap.putString("customer", customerReceipt)
                        receiptsMap.putString("merchant", merchantReceipt)

                    }

                    val amountTotalsMap = Arguments.createMap().apply {
                        putDouble("subtotal", convertDecimalBaseToDouble(subtotal))
                        putDouble("total", convertDecimalBaseToDouble(total))
                        putDouble("tax", convertDecimalBaseToDouble(tax))
                        putDouble("fees", convertDecimalBaseToDouble(fees))
                        putDouble("gratuity", convertDecimalBaseToDouble(gratuity))

                    }
                    val cardInfoMap = Arguments.createMap().apply {
                        putString("aid", aid)
                        putString("presentationMethod", cardInfo?.presentationMethod.toString())
                        putString("paymentBrand", cardInfo?.paymentBrand.toString())
                        putString("cardStatus", cardInfo?.cardStatus.toString())
                        //putString("accountType", cardInfo?.accountType.toString());
                        //putString("cardToken", cardInfo?.cardToken.toString());
                        //putString("accountReference", cardInfo?.accountReference.toString());
                        //putString("cardPan", cardInfo?.cardPan.toString());
                        putString("cardPanLast4", cardInfo?.panLast4.toString())
                        putString("cardCountry", cardInfo?.cardCountry.toString())
                        putString("cardToken", cardInfo?.cardToken.toString())

                    }

                    val paymentMap = Arguments.createMap().apply {
                        putMap("cardInfo", cardInfoMap)
                        putMap("amountTotals", amountTotalsMap)
                        putString("paymentId", lastPayment?.paymentId)
                        //putString("paymentMethod", lastPayment?.paymentMethod);
                        putString("localPaymentId", lastPayment?.localPaymentId)
                        putDouble("paymentAmount", convertDecimalBaseToDouble(paymentAmount))
                        putString("terminalId", lastPayment?.terminalId)
                        putString("authCode", lastPayment?.authCode)
                        //putString("hostAuthCode", lastPayment?.hostAuthCode);
                        putString("invoice", lastPayment?.invoice)
                        //putString("acquirerId", lastPayment?.acquirerId);
                        putString("terminalTimestamp", lastPayment?.timestamp)
                        putString("merchantId", lastPayment?.merchantId)
                        putString("ptid", mPsdk?.deviceInformation?.logicalDeviceId.toString())

                    }
                    val data = Arguments.createMap().apply {
                        putMap("payment", paymentMap)
                        putMap("receipts", receiptsMap)
                    }

                    val params = Arguments.createMap().apply {
                        putString("status", p0?.status.toString())
                        putString("message", p0?.message)
                        putString("type", p0?.type)
                        putString("eventCategory", "TransactionQuery")
                        putMap("data", data)
                    }

                    sendEvent(reactContext, "CommerceListenerEvent", params)
                } catch(e: Exception){
                    e.printStackTrace()
                }
            } else
            {
                Log.i(TAG, "No Payment Found")
                val params = Arguments.createMap().apply {
                    putString("status", p0?.status.toString())
                    putString("message", p0?.message)
                    putString("type", p0?.type)
                    putString("eventCategory", "TransactionQuery")
                }
                sendEvent(reactContext, "CommerceListenerEvent", params)

            }
        }

        override fun handleHostAuthorizationEvent(p0: HostAuthorizationEvent?) {
            Log.i(TAG, "In handleHostAuthorizationEvent " + p0?.message)
        }

        override fun handleHostFinalizeTransactionEvent(p0: HostFinalizeTransactionEvent?) {
            Log.i(TAG, "In handleHostFinalizeTransactionEvent " + p0?.message)
        }

        override fun handleNotificationEvent(p0: NotificationEvent?) {
            Log.i(TAG, "In handleNotificationEvent " + p0?.message)
            val params = Arguments.createMap().apply {
                putString("status", p0?.status.toString())
                putString("message", p0?.message)
                putString("type", p0?.type)
                putString("eventCategory", "Notification")
            }
            sendEvent(reactContext, "CommerceListenerEvent", params)

        }

        override fun handlePrintEvent(p0: PrintEvent?) {
            Log.i(TAG, "In handlePrintEvent " + p0?.message)
        }

        override fun handleStatus(p0: Status?) {
            Log.i(
                TAG, "In handleStatus " + p0?.status.toString() +
                        " : " + p0?.message + " : " + p0?.type
            )

            //socketEventEmitHandler.sendResponse("LOG", "PAYMENT_COMPLETED_EVENT", p0?.status.toString())
            val params = Arguments.createMap().apply {
                putString("status", p0?.status.toString());
                putString("message", p0?.message);
                putString("type", p0?.type);
                putString("eventCategory", "Status");
            }

            sendEvent(reactContext, "CommerceListenerEvent", params)

            if (p0?.type == "STATUS_INITIALIZED") {
                Log.i(TAG,"initialized")

            }
        }
    }

}