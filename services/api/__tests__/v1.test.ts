import { expect } from 'chai';
import * as util from './util';
import FormData from 'form-data';
import type { serializeComment, serializePost, serializeUser } from '../src/db/serializers';
import * as fs from 'fs';
import { join } from 'path';

util.setupTestEnvironment();
const requester = new util.Requester('localhost', process.env.TESTING_PORT ?? 80);

describe('Test API', () => {
	it('Is server alive', async () => {
		expect((await requester.makeReq('/', { method: 'GET' })).status).to.be.equal(200);
	});

	describe('/users', () => {
		it('Create User', async () => {
			const [req, data] = await util.createUser(requester);
			requester.setUser(data);
			expect(req.status).to.be.equal(200);
			expect(data.id).to.be.a('string');
			expect(data.token).to.be.a('string');
		});

		it('Get User', async () => {
			const [req, data] = await requester.make<ReturnType<typeof serializeUser>>(`/users/${requester.user!.id}`, {
				method: 'GET'
			});
			expect(req.status).to.be.equal(200);
			expect(data.info.username).to.be.a('string');
			expect(data.info.avatarURL).to.be.a('string');
			expect(data.stats.followersCount).to.equal(0);
			expect(data.stats.followingCount).to.equal(0);
			expect(data.stats.commentPoints).to.equal(0);
			expect(data.stats.postPoints).to.equal(0);
			expect(data.stats.mainfeedCount).to.equal(0);
		});

		it('Edit User', async () => {
			const newUsername = `TESTING_CHANGED_${Math.floor(Math.random() * 1000000 + 1)}`;
			const [req, data] = await requester.make<{ oldUser: ReturnType<typeof serializeUser>; newUser: ReturnType<typeof serializeUser> }>(
				`/users/${requester.user!.id}`,
				{
					method: 'PATCH',
					body: {
						username: newUsername
					}
				}
			);
			expect(req.status).to.be.equal(200);
			expect(data.newUser.info.username).to.be.equal(newUsername);
			expect(data.oldUser.info.username).to.not.equal(data.newUser.info.username);
		});

		it("Delete User That Isn't Them", async () => {
			const [_req, userData] = await util.createUser(requester);
			const [req, data] = await requester.make(`/users/${userData.id}`, {
				method: 'DELETE'
			});

			expect(req.status).to.be.equal(403);
			expect(data.code).to.be.equal('FORBIDDEN');
			expect(data.errors).to.be.an('array');
			expect(data.errors[0]).to.be.deep.equal({ message: 'You do not have permission to delete this user.' });
		});

		it('Delete User', async () => {
			const [req, data] = await requester.make(`/users/${requester.user!.id}`, {
				method: 'DELETE'
			});
			expect(req.status).to.be.equal(200);
			expect(data.deleted).to.be.equal(true);
			requester.setUser(undefined);
		});
	});

	describe('/posts', () => {
		let post: ReturnType<typeof serializePost>;
		let comment: ReturnType<typeof serializeComment>;

		it('Create Post', async () => {
			const [_req, userData] = await util.createUser(requester);
			requester.setUser(userData);

			const body = new FormData();
			body.append('title', 'TESTING_TITLE');
			body.append('category', 'RANDOM CATEGORY');
			body.append('image', fs.createReadStream(join(__dirname, 'test-image.jpg')));
			const [req, postData] = await requester.make<ReturnType<typeof serializePost>>('/posts', {
				method: 'POST',
				headers: body.getHeaders(),
				body
			});
			expect(req.status).to.be.equal(200);
			expect(postData.author).to.be.equal(requester.user!.id);
			expect(postData.shortURL).is.a('string');
			expect(postData.contentURL).is.a('string');
			expect(postData.upvotes).to.be.equal(0);
			expect(postData.downvotes).to.be.equal(0);
			expect(postData.title).is.a('string');
			expect(postData.deleted).to.be.equal(false);
			post = postData;
		});

		it('Create Comment', async () => {
			const [req, data] = await requester.make<ReturnType<typeof serializeComment>>(`/posts/${post.shortURL}/comments`, {
				method: 'POST',
				body: {
					content: 'TESTING_CONTENT'
				}
			});
			expect(req.status).to.be.equal(200);
			expect(data.author).to.be.equal(requester.user!.id);
			expect(data.post).is.be.equal(post._id);
			expect(data.upvotes).to.be.equal(0);
			expect(data.downvotes).to.be.equal(0);
			expect(data.content).is.a('string');
			expect(data.deleted).to.be.equal(false);
			expect(data.author).to.be.equal(requester.user!.id);
			comment = data;
		});

		it('Edit Comment', async () => {
			const [req, data] = await requester.make<{
				oldComment: ReturnType<typeof serializeComment>;
				newComment: ReturnType<typeof serializeComment>;
			}>(`/posts/${post.shortURL}/comments/${comment._id}`, {
				method: 'PATCH',
				body: {
					content: 'TESTING_CONTENT_1'
				}
			});
			expect(req.status).to.be.equal(200);
			expect(data.oldComment.author).to.be.equal(data.newComment.author);
			expect(data.oldComment.post).is.be.equal(data.newComment.post);
			expect(data.newComment.upvotes).to.be.equal(0);
			expect(data.newComment.downvotes).to.be.equal(0);
			expect(data.oldComment.content).to.be.not.equal(data.newComment.content);
			expect(data.newComment.deleted).to.be.equal(false);
		});

		it('Delete Comment', async () => {
			const [req, data] = await requester.make<ReturnType<typeof serializeComment>>(`/posts/${post.shortURL}/comments/${comment._id}`, {
				method: 'DELETE'
			});
			expect(req.status).to.be.equal(200);
			expect(data.author).to.be.equal(comment.author);
			expect(data.post).is.be.equal(comment.post);
			expect(data.upvotes).to.be.equal(0);
			expect(data.downvotes).to.be.equal(0);
			expect(data.content).to.be.not.equal(comment.content);
			expect(data.deleted).to.be.equal(true);
		});

		it('Delete Post', async () => {
			const [req, data] = await requester.make<ReturnType<typeof serializePost>>(`/posts/${post.shortURL}`, {
				method: 'DELETE'
			});

			expect(req.status).to.be.equal(200);
			expect(data.deleted).to.be.equal(true);
			expect(req.status).to.be.equal(200);
			expect(data.author).is.a('string');
			expect(data.shortURL).is.a('string');
			expect(data.contentURL).is.a('string');
			expect(data.upvotes).to.be.equal(0);
			expect(data.downvotes).to.be.equal(0);
			expect(data.title).is.a('string');
			expect(data.deleted).to.be.equal(true);
			requester.setUser(undefined);
		});
	});
});
