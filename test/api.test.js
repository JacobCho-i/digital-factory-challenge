const request = require('supertest');
const { expect } = require('chai');
const app = require('./backend-test');

function generateRandomString() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const randomEmail = `${generateRandomString()}@test.com`;
var JWT_token = ''

describe('User API', () => {

  it('POST /api/register - should create a user', async () => {
      const res = await request(app)
      .post('/api/register')
      .send({ username: 'John Doe', email: randomEmail, password: '1234' })
      .set('Accept', 'application/json');

        
      expect(res.status).to.equal(201);
    
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('user');

      expect(res.body.user).to.have.property('username', 'John Doe');
      expect(res.body.user).to.have.property('email', randomEmail);
  });

  it('POST /api/login - should log in user', async () => {
    const res = await request(app)
    .post('/api/login')
    .send({ email: randomEmail, password: '1234' })
    .set('Accept', 'application/json');
      
    expect(res.status).to.equal(200);
  
    expect(res.body).to.have.property('token');
    expect(res.body).to.have.property('user');
    JWT_token = res.body.token

    expect(res.body.user).to.have.property('email', randomEmail);
  });

  

  it('POST /api/register - should prevent duplicate user (users with same email)', async () => {
    const res = await request(app)
    .post('/api/register')
    .send({ username: 'John Doe', email: randomEmail, password: '1234' })
    .set('Accept', 'application/json');

    expect(res.status).to.equal(400);
});

});

describe('Task API', () => {

  var task_id = ''

  it('POST /api/task - should create a task', async () => {
      const res = await request(app)
      .post('/api/task')
      .send({ content: 'test task' })
      .set('Authorization', `Bearer ${JWT_token}`)
        
      expect(res.status).to.equal(201);

      expect(res.body).to.have.property('content');
      expect(res.body).to.have.property('user_id');
      expect(res.body).to.have.property('_id');

      task_id = res.body._id
      expect(res.body).to.have.property('content', 'test task');
  });

  it('PUT /api/task/:id - should update a task', async () => {
    const res = await request(app)
    .put(`/api/task/${task_id}`)
    .send({ content: 'editted test task' })
    .set('Authorization', `Bearer ${JWT_token}`)
      
    expect(res.status).to.equal(200);

    expect(res.body).to.have.property('content');
    expect(res.body).to.have.property('user_id');
    expect(res.body).to.have.property('_id');


    expect(res.body._id = task_id)
    expect(res.body).to.have.property('content', 'editted test task');
  });


  it('GET /api/task - should view a task', async () => {
    const res = await request(app)
    .get('/api/task')
    .set('Authorization', `Bearer ${JWT_token}`)
      
    expect(res.status).to.equal(200);
    
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
    expect(res.body[0]).to.have.property('content', 'editted test task');
  });

  
  it('DELETE /api/task/:id - should delete a task', async () => {
    const res = await request(app)
    .delete(`/api/task/${task_id}`)
    .set('Authorization', `Bearer ${JWT_token}`)
      
    expect(res.status).to.equal(200);
  
    expect(res.body).to.have.property('message', 'task deleted');
 });

});