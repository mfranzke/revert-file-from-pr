#!/usr/bin/env node
// File entrypoint.js

import { Octokit } from '@octokit/rest';
import fs from 'node:fs';
import process from 'node:process';

async function main() {
	console.log('Parsing comment payload...');

	const { GITHUB_TOKEN } = process.env;
	const { GITHUB_REPOSITORY } = process.env;
	const { GITHUB_EVENT_PATH } = process.env;

	if (!GITHUB_TOKEN || !GITHUB_REPOSITORY || !GITHUB_EVENT_PATH) {
		console.error('Missing required GitHub Actions environment variables.');
		process.exit(1);
	}

	const [owner, repo] = GITHUB_REPOSITORY.split('/');
	const event = JSON.parse(fs.readFileSync(GITHUB_EVENT_PATH, 'utf-8'));

	// Use event context for PR number and comment
	const PR_NUMBER = event.issue?.number || event.pull_request?.number;
	const COMMENT_BODY = event.comment?.body;

	if (!PR_NUMBER || !COMMENT_BODY) {
		console.error(
			'Could not determine PR number or comment body from event payload.'
		);
		process.exit(1);
	}

	const match = COMMENT_BODY.match(/^\/revert-file\s+(.+)$/);
	if (!match) {
		console.log('No matching /revert-file command found.');
		return;
	}

	const FILE_TO_REVERT = match[1];
	console.log(`File to revert: ${FILE_TO_REVERT}`);

	const octokit = new Octokit({ auth: GITHUB_TOKEN });

	// Get PR info
	const pr = await octokit.pulls.get({ owner, repo, pull_number: PR_NUMBER });
	const BASE_BRANCH = pr.data.base.ref;
	const HEAD_BRANCH = pr.data.head.ref;

	// Get file content from base branch
	let baseFile;
	try {
		baseFile = await octokit.repos.getContent({
			owner,
			repo,
			path: FILE_TO_REVERT,
			ref: BASE_BRANCH
		});
	} catch (error) {
		console.error(
			`Failed to fetch file '${FILE_TO_REVERT}' from base branch:`,
			error.message
		);
		process.exit(1);
	}

	if (!baseFile.data.content || !baseFile.data.sha) {
		console.error(
			'Could not retrieve file content or sha from base branch.'
		);
		process.exit(1);
	}

	// Get file sha from head branch (needed for update)
	let headFileSha;
	try {
		const headFile = await octokit.repos.getContent({
			owner,
			repo,
			path: FILE_TO_REVERT,
			ref: HEAD_BRANCH
		});
		headFileSha = headFile.data.sha;
	} catch (error) {
		// If file doesn't exist in head branch, sha stays undefined
		if (error.status !== 404) {
			console.error(
				`Failed to fetch file from head branch:`,
				error.message
			);
			process.exit(1);
		}
	}

	// Update file in head branch with base branch content
	try {
		await octokit.repos.createOrUpdateFileContents({
			owner,
			repo,
			path: FILE_TO_REVERT,
			message: `Revert ${FILE_TO_REVERT} to base branch (${BASE_BRANCH}) version`,
			content: baseFile.data.content,
			sha: headFileSha,
			branch: HEAD_BRANCH,
			committer: {
				name: 'GitHub Actions Bot',
				email: 'actions@github.com'
			},
			author: {
				name: 'GitHub Actions Bot',
				email: 'actions@github.com'
			}
		});
		console.log(`✅ Reverted ${FILE_TO_REVERT} in PR #${PR_NUMBER}`);
	} catch (error) {
		console.error('Failed to update file in head branch:', error.message);
		process.exit(1);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
