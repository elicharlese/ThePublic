/**
 * Load Testing Script for ThePublic Backend
 * Tests API performance under various load conditions
 */

const axios = require('axios');
const { performance } = require('perf_hooks');

interface LoadTestConfig {
  baseUrl: string;
  concurrentUsers: number;
  testDuration: number; // in seconds
  endpoints: string[];
}

interface TestResult {
  endpoint: string;
  requestCount: number;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  errorCount: number;
  successRate: number;
}

class LoadTester {
  private config: LoadTestConfig;
  private results: Map<string, number[]> = new Map();
  private errors: Map<string, number> = new Map();

  constructor(config: LoadTestConfig) {
    this.config = config;
  }

  async runTest(): Promise<TestResult[]> {
    console.log(`Starting load test with ${this.config.concurrentUsers} concurrent users for ${this.config.testDuration} seconds`);
    
    const testPromises: Promise<void>[] = [];
    const startTime = performance.now();
    const endTime = startTime + (this.config.testDuration * 1000);

    // Start concurrent user simulations
    for (let i = 0; i < this.config.concurrentUsers; i++) {
      testPromises.push(this.simulateUser(endTime));
    }

    await Promise.all(testPromises);
    
    return this.calculateResults();
  }

  private async simulateUser(endTime: number): Promise<void> {
    while (performance.now() < endTime) {
      const endpoint = this.getRandomEndpoint();
      await this.makeRequest(endpoint);
      
      // Wait a bit between requests to simulate real user behavior
      await this.sleep(Math.random() * 1000 + 500);
    }
  }

  private async makeRequest(endpoint: string): Promise<void> {
    const startTime = performance.now();
    
    try {
      const response = await axios.get(`${this.config.baseUrl}${endpoint}`, {
        timeout: 10000,
      });
      
      const responseTime = performance.now() - startTime;
      this.recordResponse(endpoint, responseTime);
      
    } catch (error) {
      const responseTime = performance.now() - startTime;
      this.recordError(endpoint, responseTime);
    }
  }

  private recordResponse(endpoint: string, responseTime: number): void {
    if (!this.results.has(endpoint)) {
      this.results.set(endpoint, []);
    }
    this.results.get(endpoint)!.push(responseTime);
  }

  private recordError(endpoint: string, responseTime: number): void {
    if (!this.errors.has(endpoint)) {
      this.errors.set(endpoint, 0);
    }
    this.errors.set(endpoint, this.errors.get(endpoint)! + 1);
    
    // Still record response time for failed requests
    this.recordResponse(endpoint, responseTime);
  }

  private getRandomEndpoint(): string {
    const randomIndex = Math.floor(Math.random() * this.config.endpoints.length);
    return this.config.endpoints[randomIndex];
  }

  private calculateResults(): TestResult[] {
    const results: TestResult[] = [];

    for (const [endpoint, responseTimes] of this.results.entries()) {
      const requestCount = responseTimes.length;
      const errorCount = this.errors.get(endpoint) || 0;
      const successCount = requestCount - errorCount;
      
      const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / requestCount;
      const maxResponseTime = Math.max(...responseTimes);
      const minResponseTime = Math.min(...responseTimes);
      const successRate = (successCount / requestCount) * 100;

      results.push({
        endpoint,
        requestCount,
        averageResponseTime,
        maxResponseTime,
        minResponseTime,
        errorCount,
        successRate,
      });
    }

    return results;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Load test configurations
const lightLoadConfig: LoadTestConfig = {
  baseUrl: 'http://localhost:3000',
  concurrentUsers: 10,
  testDuration: 30,
  endpoints: [
    '/api/health',
    '/api/blog/posts',
    '/api/nodes',
    '/api/network/stats',
  ],
};

const mediumLoadConfig: LoadTestConfig = {
  baseUrl: 'http://localhost:3000',
  concurrentUsers: 50,
  testDuration: 60,
  endpoints: [
    '/api/health',
    '/api/blog/posts',
    '/api/nodes',
    '/api/network/stats',
    '/api/network/map',
  ],
};

const heavyLoadConfig: LoadTestConfig = {
  baseUrl: 'http://localhost:3000',
  concurrentUsers: 100,
  testDuration: 120,
  endpoints: [
    '/api/health',
    '/api/blog/posts',
    '/api/nodes',
    '/api/network/stats',
    '/api/network/map',
    '/api/notifications',
  ],
};

// Main execution
async function runLoadTests(): Promise<void> {
  console.log('🚀 Starting Load Tests for ThePublic Backend\n');

  const configs = [
    { name: 'Light Load', config: lightLoadConfig },
    { name: 'Medium Load', config: mediumLoadConfig },
    { name: 'Heavy Load', config: heavyLoadConfig },
  ];

  for (const { name, config } of configs) {
    console.log(`\n📊 Running ${name} Test...`);
    
    const tester = new LoadTester(config);
    const results = await tester.runTest();
    
    console.log(`\n✅ ${name} Test Results:`);
    console.log('=' .repeat(80));
    
    results.forEach(result => {
      console.log(`\nEndpoint: ${result.endpoint}`);
      console.log(`  Requests: ${result.requestCount}`);
      console.log(`  Avg Response Time: ${result.averageResponseTime.toFixed(2)}ms`);
      console.log(`  Max Response Time: ${result.maxResponseTime.toFixed(2)}ms`);
      console.log(`  Min Response Time: ${result.minResponseTime.toFixed(2)}ms`);
      console.log(`  Error Count: ${result.errorCount}`);
      console.log(`  Success Rate: ${result.successRate.toFixed(1)}%`);
    });

    // Performance analysis
    const overallAverage = results.reduce((sum, r) => sum + r.averageResponseTime, 0) / results.length;
    const overallSuccessRate = results.reduce((sum, r) => sum + r.successRate, 0) / results.length;
    
    console.log(`\n📈 Overall Performance:`);
    console.log(`  Average Response Time: ${overallAverage.toFixed(2)}ms`);
    console.log(`  Overall Success Rate: ${overallSuccessRate.toFixed(1)}%`);
    
    // Performance benchmarks
    if (overallAverage > 1000) {
      console.log(`⚠️  Warning: Average response time exceeds 1000ms`);
    }
    if (overallSuccessRate < 95) {
      console.log(`❌ Error: Success rate below 95%`);
    }
    if (overallAverage < 500 && overallSuccessRate > 99) {
      console.log(`🎉 Excellent: Great performance and reliability!`);
    }

    // Wait between tests
    console.log('\n⏳ Waiting 30 seconds before next test...');
    await new Promise(resolve => setTimeout(resolve, 30000));
  }

  console.log('\n🏁 All load tests completed!');
}

// Export for use in tests
module.exports = { LoadTester, runLoadTests };

// Run if called directly
if (require.main === module) {
  runLoadTests().catch(console.error);
}
