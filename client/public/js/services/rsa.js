
import "/client/public/js/libraries/jsencrypt.js";
import { CONF_APP } from "/client/public/js/config.js";

window.RSA = (function () {
    let instance;

    function init(keyList) {
        class RSA {
            rsas;
            config

            constructor(keyList) {
                this.rsas = [];
                this.config = CONF_APP.encrypt;

                for (let i = 0; i < keyList.length; i++) {
                    let rsa = keyList[i];
                    this.add(
                        rsa.id,
                        rsa.publicKey,
                        rsa.privateKey,
                    );
                }

            }

            add(id, publicKey, privateKey) {
                this.rsas.push(
                    {
                        id,
                        publicKey,
                        privateKey,
                    }
                );
            }

            remove(id) {
                let index = this.rsas.findIndex((rsa) => {
                    if (rsa.id == id) {
                        return true;
                    }
                });

                if (index != -1) {
                    this.rsas.splice(index, 1);
                    return true;
                }

                return false;
            }

            clear() {
                this.rsas = [];
            }

            find(id) {
                let index = this.rsas.findIndex((rsa) => {
                    if (rsa.id == id) {
                        return true;
                    }
                });

                return this.rsas[index];
            }

            decrypt(id, data) {
                let uncrypted = null;

                let rsa = this.find(id);
                if (rsa) {
                    let decrypt = new JSEncrypt({ default_key_size: this.config.default_key_size });
                    decrypt.setPrivateKey(rsa.privateKey);
                    uncrypted = decrypt.decrypt(data);
                }

                return uncrypted;
            }

            encrypt(id, data) {
                let encrypted = null;

                let rsa = this.find(id);
                if (rsa) {
                    let encrypt = new JSEncrypt({ default_key_size: this.config.default_key_size });
                    encrypt.setPublicKey(rsa.publicKey);
                    encrypted = encrypt.encrypt(data);
                }

                return encrypted;
            }

            decryptImage(id, data) {
                let uncrypted = null;

                let rsa = this.find(id);
                if (rsa) {
                    let indexLast = data.search("last=");
                    if (indexLast != -1) {
                        let last = data.slice(indexLast);
                        let indexCode = data.search("code=");
                        let codeAndLast = data.slice(indexCode);

                        let d = codeAndLast.replace(last, "");
                        d = d.replace("code=", "");

                        let decrypt = new JSEncrypt({ default_key_size: this.config.default_key_size });
                        decrypt.setPrivateKey(rsa.privateKey);
                        let unted = decrypt.decrypt(d);

                        data = data.replace(codeAndLast, "");
                        uncrypted = data + unted;
                    }
                }

                return uncrypted;
            }

            encryptImage(id, data) {
                let encrypted = null;

                let rsa = this.find(id);
                if (rsa) {
                    let d = data.data.slice(-5);

                    let encrypt = new JSEncrypt({ default_key_size: this.config.default_key_size });
                    encrypt.setPublicKey(rsa.publicKey);
                    let ented = encrypt.encrypt(d);
                    encrypted = data.data.replace(d, "") + "code=" + ented + "last=" + ented.length;
                }

                return encrypted;
            }
        }

        // Create RSA
        return new RSA(keyList);
    }

    return {
        getInstance: function (keyList = []) {
            if (!instance) {
                instance = init(keyList);
            }
            return instance;
        }
    }
})();