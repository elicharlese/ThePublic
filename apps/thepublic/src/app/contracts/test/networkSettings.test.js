const request = require('supertest');
const express = require('express');
const sinon = require('sinon');
const chai = require('chai');
const networkManager = require('../path/to/networkManager');
const networkSettingsRoutes = require('../path/to/routes/networkSettingsRoutes');

const { expect } = chai;
const app = express();
app.use(express.json());
app.use('/api/network-settings', networkSettingsRoutes);

describe('Network Settings API', function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get all network settings', async function () {
    sandbox.stub(networkManager, 'getAllNetworkSettings').resolves('Sample network settings output');

    await request(app)
      .get('/api/network-settings')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.text).to.equal('Sample network settings output');
      });
  });

  it('should get network setting by ID', async function () {
    sandbox.stub(networkManager, 'getNetworkSettingById').resolves('Sample network setting by ID output');

    await request(app)
      .get('/api/network-settings/sample-id')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.text).to.equal('Sample network setting by ID output');
      });
  });

  it('should create a new network setting', async function () {
    sandbox.stub(networkManager, 'createNetworkSetting').resolves('Network setting created');

    await request(app)
      .post('/api/network-settings')
      .send({
        settingName: 'wifi',
        value: 'sample-value',
      })
      .expect(201)
      .then((response) => {
        expect(response.text).to.equal('Network setting created');
      });
  });

  it('should update an existing network setting', async function () {
    sandbox.stub(networkManager, 'updateNetworkSetting').resolves('Network setting updated');

    await request(app)
      .put('/api/network-settings/sample-id')
      .send({
        prop: 'property',
        value: 'new-value',
      })
      .expect(200)
      .then((response) => {
        expect(response.text).to.equal('Network setting updated');
      });
  });

  it('should delete an existing network setting', async function () {
    sandbox.stub(networkManager, 'deleteNetworkSetting').resolves('Network setting deleted');

    await request(app)
      .delete('/api/network-settings/sample-id')
      .expect(200)
      .then((response) => {
        expect(response.text).to.equal('Network setting deleted');
      });
  });
});