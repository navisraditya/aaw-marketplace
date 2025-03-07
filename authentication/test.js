import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '2m', target: 500 }, // Ramp-up to 200 VUs in 1 min
        { duration: '3m', target: 1000 }, // Stay at 200 VUs for 2 min
        { duration: '5m', target: 1000 },
        { duration: '2m', target: 0 },  // Ramp-down to 0 VUs
    ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests <500ms
    http_req_failed: ['rate<0.01'],   // <1% failure rate
  },
};

export default function () {
  let res = http.get('http://localhost:8000/'); // Replace with your microservice endpoint
  check(res, {
    'is status 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1); // Simulate realistic user wait time
}
