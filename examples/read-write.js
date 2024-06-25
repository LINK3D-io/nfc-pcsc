"use strict";

// #############
// Example: Reading and writing data
// - should work well with any compatible PC/SC card reader
// - tested with MIFARE Ultralight cards but should work with many others (e.g. NTAG)
// - what is covered:
//   - example reading and writing data on from/to card
// - NOTE! for reading and writing data from/to MIFARE Classic please see examples/mifare-classic.js which explains MIFARE Classic specifics
// #############

import { NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B } from '../src/index';
import pretty from './pretty-logger';
import request from '../src/services/request';
import { login } from '../src/services/auth';
import { addTag } from '../src/services/tags';
import { v4 as uuidv4 } from 'uuid';
import * as ndef from 'ndef';

const nfc = new NFC(); // const nfc = new NFC(pretty); // optionally you can pass logger to see internal debug logs

function createUriNdefRecord(url) {
    const record = ndef.uriRecord(url);
    return ndef.encodeMessage([record]);
}

nfc.on('reader', async reader => {
	pretty.info(`read write`);
	// Login to server
	const user = "jon";
	const loginData = await login(user, "catcatcat");
	request.setAccessToken(loginData.credentials.access);

	pretty.info(`device attached`, reader);
	reader.aid = 'F222222222';

	reader.on('card', async card => {

		pretty.info(`card detected`, reader, card);

		const blockSize = 4;
		const blockCount = 15;
		let urlRead = '';

		for (let i = 0; i < blockCount; i++) {
			try {
				const blockData = await reader.read(4 + i, blockSize);
				// Convert buffer to string part and append it
				urlRead += blockData.toString();
			} catch (err) {
				pretty.error(`Error when reading data from the card:`, reader, err);
			}
		}
		// Process the URL string to remove any null characters (padding)
		urlRead = urlRead.replace(/\0/g, ''); // Remove null characters if any
		pretty.info("URLREAD HEELLO", urlRead)

		if (urlRead.startsWith('https://')) {
			pretty.info(`URL already added: `, urlRead);
		} else {
			// Generate UUID and create URL
			const uniqueId = uuidv4();
			const urlToWrite = `https://link3d.io/tags/${uniqueId}/�`;
			const ndefData = createUriNdefRecord(urlToWrite);

			// Ensure the data fits into the blocks by creating a buffer of appropriate size
			// Assuming a block size of 4 and you find the minimum number of blocks needed
			const dataToWrite = Buffer.from(ndefData);
			const writeBlockCount = Math.ceil(dataToWrite.length / blockSize);
			const totalBytes = writeBlockCount * blockSize; // Total bytes to match the block size
			const paddedData = Buffer.alloc(totalBytes, 0); // Allocate buffer and fill with zeros
			dataToWrite.copy(paddedData); // Copy the URL data into the padded buffer

			try {
				// Write each block
				for (let i = 0; i < writeBlockCount; i++) {
					const blockData = paddedData.subarray(i * blockSize, (i + 1) * blockSize);
					// await reader.write(4 + i, blockData);
				}

				// Add tag to server
				// await addTag(loginData.sponsorId, uniqueId);
				pretty.info(`Added tag to server:`, uniqueId);
				// pretty.info(`Wrote URL:`, ndefData);
			} catch (err) {
				pretty.error(`Error when writing data to the card:`, reader, err);
			}
		}
	});

	reader.on('error', err => {
		pretty.error(`an error occurred`, reader, err);
	});

	reader.on('end', () => {
		pretty.info(`device removed`, reader);
	});


});

nfc.on('error', err => {
	pretty.error(`an error occurred`, err);
});
