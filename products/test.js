import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10, // Virtual Users
  duration: '30s', // Test duration
};

export default function () {
  let res = http.get('https://test-api.k6.io');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1); // Simulates user wait time
}
