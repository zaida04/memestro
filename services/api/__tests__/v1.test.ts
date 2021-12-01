import { expect } from 'chai';
import * as util from './util';

util.setupTestEnvironment();
const requester = new util.Requester('localhost', process.env.TESTING_PORT!);

describe('Test API', () => {
	describe('/users', () => {
		it('Is server alive', async () => {
			expect((await requester.makeReq('/', { method: 'GET' })).status).to.be.equal(200);
		});

		it('Create User', async () => {
			const [req, data] = await util.createUser(requester);
			requester.setUser(data);
			expect(req.status).to.be.equal(200);
			expect(data.id).to.be.a('string');
			expect(data.token).to.be.a('string');
		});

		it('Get User', async () => {
			const [req, data] = await requester.make(`/users/${requester.user!.id}`, {
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
			const [req, data] = await requester.make(`/users/${requester.user!.id}`, {
				method: 'PATCH',
				body: {
					username: newUsername
				}
			});
			expect(req.status).to.be.equal(200);
			expect(data.newUser.info.username).to.be.equal(newUsername);
			expect(data.oldUser.info.username).to.not.equal(data.newUser.info.username);
			expect(data.oldUser.info.email).to.equal(data.newUser.info.email);
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

	// describe('/posts', () => {
	// 	it('Create Post', async () => {});

	// 	it('Delete Post', async () => {});

	// 	it('Get Post', async () => {});
	// });

	// it('Create Post', async () => {
	// 	expect((await requester('/', { method: 'GET' })[0]).status).to.be.equal(200);
	// });
	// it('Delete Post', async () => {
	// 	expect((await requester('/', { method: 'GET' })[0]).status).to.be.equal(200);
	// });
	// it('Get Post', async () => {
	// 	expect((await requester('/', { method: 'GET' })[0]).status).to.be.equal(200);
	// });
	// it('Make Comment', async () => {
	// 	expect((await requester('/', { method: 'GET' })[0]).status).to.be.equal(200);
	// });
	// it('Delete Comment', async () => {
	// 	expect((await requester('/', { method: 'GET' })[0]).status).to.be.equal(200);
	// });
	// it('Edit Comment', async () => {
	// 	expect((await requester('/', { method: 'GET' })[0]).status).to.be.equal(200);
	// });
});
