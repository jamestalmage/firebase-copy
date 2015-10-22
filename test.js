'use strict';
var assert = require('assert');
var firebaseCopy = require('./');
var sinon = require('sinon');
var assertSpy = sinon.assert;

it('should create distinct copies of the Firebase constructor', function (done) {
	this.timeout(5000);

	var Firebase1 = firebaseCopy();
	var Firebase2 = firebaseCopy();

	assert.notStrictEqual(Firebase1, Firebase2);

	var root1a = new Firebase1('https://jt-sandbox.firebaseio.com/');
	var root1b = new Firebase1('https://jt-sandbox.firebaseio.com/');
	var root2 = new Firebase2('https://jt-sandbox.firebaseio.com/');

	var uid = root1a.child('firebase-copy-test').push().key();

	var ref1a = root1a.child('firebase-copy-test').child(uid);
	var ref1b = root1b.child('firebase-copy-test').child(uid);
	var ref2 = root2.child('firebase-copy-test').child(uid);

	var spy1a = sinon.spy(function spy1a() {});
	var spy1b = sinon.spy(function spy1b() {});
	var spy2 = sinon.spy(function spy2() {});

	ref1a.on('value', spy1a);
	ref1b.on('value', spy1b);
	ref2.on('value', spy2);

	assertSpy.notCalled(spy1a);
	assertSpy.notCalled(spy1b);
	assertSpy.notCalled(spy2);

	ref1a.set('hello');

	// Instances from two separate constructors do not share the same global state.
	assertSpy.called(spy1a);
	assertSpy.called(spy1b);
	assertSpy.notCalled(spy2);

	ref2.on('value', function (snap) {
		if (snap.val() === null) {
			return;
		}
		assert.strictEqual(snap.val(), 'hello');
		done();
	});
});
