// var assert = require('assert');
// describe('Array', function() {
//   describe('#indexOf()', function() {
//     it('should return -1 when the value is not present', function() {
//       assert.equal([1, 2, 3].indexOf(4), -1);
//     });
//   });
// });

const request = require('supertest')
const expect = require('chai').expect

describe('api test', () => {
    it('books list api', (done) => {
        request('http://localhost:3000')
            .get('/api/getBooksList')
            .expect(200)
            .end((err, res) => {
                expect(res.body.length).equal(1)
                done()
            })
    }) 
})