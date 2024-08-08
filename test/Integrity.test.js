const assert = require('assert');
const Integrity = require('../dist');

describe('Integrity tests', () => {

    it('Integrity.generateSignature', () => {

        const signature = Integrity.generateSignature({
            "hello": "world"
        }, 'f441bb4d-9cd3-410a-8ede-cefd33cf3fa0')

        assert.equal(signature, "ba1cf4f1a0d5659a4c7dd8c70f74788a532c644c65eeb3d46d9e56cdb22eaeaa");
    });

    it('Integrity.validateSignature true', () => {

        const validation = Integrity.validateSignature({
            "hello": "world",
            "signature": "ba1cf4f1a0d5659a4c7dd8c70f74788a532c644c65eeb3d46d9e56cdb22eaeaa"
        }, 'f441bb4d-9cd3-410a-8ede-cefd33cf3fa0')

        assert.equal(validation, true);
    });

    it('Integrity.validateSignature false', () => {

        const validation = Integrity.validateSignature({
            "hello": "world",
            "signature": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        }, 'f441bb4d-9cd3-410a-8ede-cefd33cf3fa0')

        assert.equal(validation, false);
    });

    it('Integrity.getSignedObject', () => {

        const signedObject = Integrity.getSignedObject({
            "hello": "world",
        }, 'f441bb4d-9cd3-410a-8ede-cefd33cf3fa0')

        assert.deepEqual(signedObject, {
            "hello": "world",
            "signature": "ba1cf4f1a0d5659a4c7dd8c70f74788a532c644c65eeb3d46d9e56cdb22eaeaa"
        });
    });

    it('Integrity.getSignedObjectWithUndefined', () => {

        const signedObject = Integrity.getSignedObject({
            "hello": "world",
            "prueba": undefined,
        }, 'f441bb4d-9cd3-410a-8ede-cefd33cf3fa0')

        assert.equal(signedObject.signature, "ba1cf4f1a0d5659a4c7dd8c70f74788a532c644c65eeb3d46d9e56cdb22eaeaa");
    });
});
