"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const connection_1 = require("./connection");
const wallet_helper_1 = require("./wallet-helper");
const constants_1 = require("../models/constants");
const firestore_service_1 = require("./firestore-service");
const stellar_service_1 = require("./stellar-service");
const z = "\n\n";
class TransactionService {
    static send(userName, functioName, jsonString) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let start1 = new Date().getTime();
            const mResults = [];
            try {
                //todo - user wallet to be used here
                const wallet = yield wallet_helper_1.WalletHelper.getAdminWallet();
                const contract = yield connection_1.ConnectToChaincode.getContract(userName, wallet);
                const list = JSON.parse(jsonString);
                let index = 0;
                if (Object.prototype.toString.call(list) === '[object Array]') {
                    console.log(`▶️ ▶️ ▶️ Process a list of transactions ... length: 💙❤️ ${list.length} ▶️ ▶️ ▶️ `);
                    for (const m of list) {
                        const resp = yield this.submit(contract, functioName, JSON.stringify(m), index);
                        index++;
                        mResults.push(resp.result);
                    }
                    const m = `🍓 🍓 🍓 ${mResults.length} transactions of 🔆🔆 ${functioName} processed  🍓 🍓 🍓`;
                    console.log(m);
                    return {
                        message: m,
                        result: mResults,
                        statusCode: 200
                    };
                }
                else {
                    console.log(`▶️ ▶️ ▶️ Process just 1 transaction ...`);
                    const resp = yield this.submit(contract, functioName, jsonString, 0);
                    return {
                        message: `🥦 🥦 🥦 ${functioName} processed  🥦 🥦 🥦`,
                        result: resp.result,
                        statusCode: 200
                    };
                }
            }
            catch (e) {
                const msg = `👿 👿 👿 Error processing transaction, throwing my toys 👿 👿 👿${z}${e}${z}`;
                console.log(msg);
                throw new Error(msg);
            }
        });
    }
    static submit(contract, functionName, jsonString, index) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🍀 🍀 🍀 🍀  submitting transaction to BFN ... 💦 index: ${index}, 💦 functionName: ${functionName} ....`);
            const transaction = contract.createTransaction(functionName);
            const start1 = new Date().getTime();
            let payload;
            if (functionName.startsWith("get")) {
                if (jsonString) {
                    payload = yield transaction.evaluate(jsonString);
                }
                else {
                    payload = yield transaction.evaluate();
                }
            }
            else {
                if (jsonString) {
                    payload = yield transaction.submit(jsonString);
                }
                else {
                    payload = yield transaction.submit();
                }
            }
            const end = new Date().getTime();
            const elapsed4 = (end - start1) / 1000;
            const response = JSON.parse(payload.toString());
            console.log(`☕️  ☕️  ☕️  PAYLOAD! status code: 😡 ${response.statusCode} 😡 ${response.message} ☕️  ☕️  ☕️  transaction: 😡 ${functionName}`);
            console.log(`⌛️❤️ BFN Contract execution took ❤️ ${elapsed4} seconds\n`);
            if (response.statusCode === 200) {
                yield this.writeToFirestore(functionName, JSON.stringify(response.result));
                const end = new Date().getTime();
                const elapsed4 = (end - start1) / 1000;
                console.log(`⌛️❤️  Contract Execution + Firestore Write:  ❤️  took ${elapsed4} seconds:  😎 😎 😎\n\n`);
            }
            else {
                console.log(`👿 👿 👿  contract execution fucked up in ${elapsed4} seconds: 👿 👿 👿 ${response.message}\n\n`);
            }
            return response;
        });
    }
    static writeToFirestore(functioName, payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const start = new Date().getTime();
            switch (functioName) {
                case constants_1.Constants.CHAIN_ADD_COUNTRY:
                    yield firestore_service_1.FirestoreService.writeCountry(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_USER:
                    yield firestore_service_1.FirestoreService.writeUser(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_SECTOR:
                    yield firestore_service_1.FirestoreService.writeSector(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_CUSTOMER:
                    yield stellar_service_1.StellarWalletService.createWallet(JSON.parse(payload).participantId);
                    yield firestore_service_1.FirestoreService.writeCustomer(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_SUPPLIER:
                    yield stellar_service_1.StellarWalletService.createWallet(JSON.parse(payload).participantId);
                    yield firestore_service_1.FirestoreService.writeSupplier(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_INVESTOR:
                    yield stellar_service_1.StellarWalletService.createWallet(JSON.parse(payload).participantId);
                    yield firestore_service_1.FirestoreService.writeInvestor(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_PURCHASE_ORDER:
                    yield firestore_service_1.FirestoreService.writePurchaseOrder(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_DELIVERY_NOTE:
                    yield firestore_service_1.FirestoreService.writeDeliveryNote(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_DELIVERY_NOTE_ACCEPTANCE:
                    yield firestore_service_1.FirestoreService.writeDeliveryAcceptance(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_INVOICE:
                    yield firestore_service_1.FirestoreService.writeInvoice(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_INVOICE_ACCEPTANCE:
                    yield firestore_service_1.FirestoreService.writeInvoiceAcceptance(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_OFFER:
                    yield firestore_service_1.FirestoreService.writeOffer(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_INVOICE_BID:
                    yield firestore_service_1.FirestoreService.writeInvoiceBid(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_INVESTOR_PROFILE:
                    yield firestore_service_1.FirestoreService.writeInvestorProfile(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_AUTOTRADE_ORDER:
                    yield firestore_service_1.FirestoreService.writeAutoTradeOrder(payload);
                    break;
                case constants_1.Constants.CHAIN_ADD_AUTOTRADE_START:
                    yield firestore_service_1.FirestoreService.writeAutoTradeStart(payload);
                    break;
                case constants_1.Constants.CHAIN_CLOSE_OFFER:
                    yield firestore_service_1.FirestoreService.closeOffer(payload);
                    break;
            }
            const end = new Date().getTime();
            const elapsed4 = (end - start) / 1000;
            console.log(`⌛️ 🔵 🔵 🔵  writeToFirestore: Firestore ${functioName}; write took  🔵 ${elapsed4} seconds  🔵 🔵 🔵`);
        });
    }
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction-service.js.map