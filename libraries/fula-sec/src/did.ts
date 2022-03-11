import { generateKeyPairFromSeed } from '@stablelib/x25519'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import {generateMnemonic} from 'bip39'
import HDWallet from 'ethereum-hdwallet'
import { DID } from 'dids'
import KeyResolver from 'key-did-resolver'

/**
 * @class FullaDID
 * @description Creates Decentrilized Identity for Clinet side application 
 * based on Ed25519 Private Key - Edwards-curve Digital Signature Algorithm(EdDSA)
 */
export class FullaDID {
    privateKey: string;
    mnemonic: string;
    authDID: string;


    constructor() {
        this.privateKey = '';
        this.mnemonic = '';
        this.authDID = '';
    }
    /**
     * This private function only class functions can use it
     * @function didProvider()
     * @property privateKey
     * @returns  authDID
     * @memberof FullaDID private member
     */
    private async didProvider () {
        let provider = new Ed25519Provider(Buffer.from(this.privateKey, 'hex'))
        let did = new DID({ provider, resolver: KeyResolver.getResolver()})
        return await did.authenticate();
         
    }
    /**
     * Creates mnemocic phrase and private key
     * @function create()
	 * @returns Object - {authDID, privateKey, mnemonic}
	 */
    async create () {
        this.mnemonic = generateMnemonic()
        let hdwallet = HDWallet.fromMnemonic(this.mnemonic)
        this.privateKey = hdwallet.derive(`m/44'/60'/0'/0/0`).getPrivateKey().toString('hex')
        this.authDID = await this.didProvider();
        return {
            mnemonic: this.mnemonic,
            privateKey: this.privateKey,
            authDID: this.authDID
        }
    }
    /**
     * Backup option
     * @function backup() - getter
	 * @returns Object - {authDID, privateKey, mnemonic}
	 */
    get backup() {
        return {
            mnemonic: this.mnemonic,
            privateKey: this.privateKey,
            authDID: this.authDID
        }
    }
    /**
     * Improt mnemonic phrases (12 random words)
     * @function importMnemonic()
     * @param mnemonic: string
	 * @returns Object - {authDID, privateKey}
	 */
    async importMnemonic (mnemonic: string) {
        let hdwallet = HDWallet.fromMnemonic(mnemonic);
        this.privateKey = hdwallet.derive(`m/44'/60'/0'/0/0`).getPrivateKey().toString('hex')
        this.authDID = await this.didProvider();
        return {
            privateKey: this.privateKey,
            authDID: this.authDID
        }
    }
    /**
     * Improt existing privateKey
     * @function imposrtPrivateKey()
     * @param privateKey: string
	 * @returns Object - {authDID, privateKey}
	 */
    async imposrtPrivateKey (privateKey: string) {
        this.privateKey = privateKey;
        this.authDID = await this.didProvider();
        return {
            privateKey: this.privateKey,
            authDID: this.authDID
        }
    }
}