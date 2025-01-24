import { strict as assert } from 'assert';
import { RedPayIntegrity } from '../dist';

describe('Pruebas de RedPayIntegrity', () => {
    // Secreto utilizado para generar y validar firmas.
    const secret = 'f441bb4d-9cd3-410a-8ede-cefd33cf3fa0';

    it('RedPayIntegrity.hashHmacSha256', () => {
        // Verifica que el hash HMAC SHA256 sea generado correctamente.
        const hash = RedPayIntegrity.hashHmacSha256("test input", secret);
        assert.equal(hash, "39db93aef628cecb40a223ccf336e7d3a93e16a66248412c01b6bcb513df243a");
    });

    it('RedPayIntegrity.generateSignature', () => {
        // Verifica que la firma generada para un objeto sea correcta.
        const signature = RedPayIntegrity.generateSignature({
            "hello": "world"
        }, secret);
        assert.equal(signature, "ba1cf4f1a0d5659a4c7dd8c70f74788a532c644c65eeb3d46d9e56cdb22eaeaa");
    });

    it('RedPayIntegrity.validateSignature - firma válida', () => {
        // Verifica que la validación sea correcta cuando la firma es válida.
        const isValid = RedPayIntegrity.validateSignature({
            "hello": "world",
            "signature": "ba1cf4f1a0d5659a4c7dd8c70f74788a532c644c65eeb3d46d9e56cdb22eaeaa"
        }, secret);
        assert.equal(isValid, true);
    });

    it('RedPayIntegrity.validateSignature - firma inválida', () => {
        // Verifica que la validación falle cuando la firma es incorrecta.
        const isValid = RedPayIntegrity.validateSignature({
            "hello": "world",
            "signature": "signature"
        }, secret);
        assert.equal(isValid, false);
    });

    it('RedPayIntegrity.getSignedObject', () => {
        // Verifica que un objeto firmado incluya la firma correcta.
        const signedObject = RedPayIntegrity.getSignedObject({
            "hello": "world"
        }, secret);
        assert.deepEqual(signedObject, {
            "hello": "world",
            "signature": "ba1cf4f1a0d5659a4c7dd8c70f74788a532c644c65eeb3d46d9e56cdb22eaeaa"
        });
    });

    it('RedPayIntegrity.getSignedObject - con propiedad undefined', () => {
        // Verifica que las propiedades undefined no afecten la generación de la firma.
        const signedObject = RedPayIntegrity.getSignedObject({
            "hello": "world",
            "unused": undefined
        }, secret);
        assert.equal(signedObject.signature, "ba1cf4f1a0d5659a4c7dd8c70f74788a532c644c65eeb3d46d9e56cdb22eaeaa");
    });

    it('RedPayIntegrity.validateSignatureOrFail - firma válida', () => {
        // Verifica que no se lance una excepción cuando la firma es válida.
        assert.doesNotThrow(() => {
            RedPayIntegrity.validateSignatureOrFail({
                "hello": "world",
                "signature": "ba1cf4f1a0d5659a4c7dd8c70f74788a532c644c65eeb3d46d9e56cdb22eaeaa"
            }, secret);
        });
    });

    it('RedPayIntegrity.validateSignatureOrFail - firma inválida', () => {
        // Verifica que se lance una excepción cuando la firma es inválida.
        assert.throws(() => {
            RedPayIntegrity.validateSignatureOrFail({
                "hello": "world",
                "signature": "signature"
            }, secret);
        }, Error);
    });
});
