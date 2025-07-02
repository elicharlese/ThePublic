import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ThePublic Backend API',
      version: '1.0.0',
      description: 'Backend API for ThePublic decentralized WiFi network',
      contact: {
        name: 'ThePublic Team',
        url: 'https://thepublic.network',
        email: 'support@thepublic.network',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.thepublic.network' 
          : 'http://localhost:3001',
        description: process.env.NODE_ENV === 'production' 
          ? 'Production server' 
          : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Error message',
                },
                stack: {
                  type: 'string',
                  example: 'Error stack trace (development only)',
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            walletAddress: {
              type: 'string',
              example: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
            },
            role: {
              type: 'string',
              enum: ['user', 'node_operator', 'admin'],
              example: 'user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-07-01T12:00:00Z',
            },
          },
        },
        Node: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            nodeId: {
              type: 'string',
              example: 'node_1234567890_abc123',
            },
            name: {
              type: 'string',
              example: 'My WiFi Node',
            },
            description: {
              type: 'string',
              example: 'High-speed WiFi access point',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'maintenance', 'suspended'],
              example: 'active',
            },
            location: {
              type: 'object',
              properties: {
                lat: {
                  type: 'number',
                  example: 37.7749,
                },
                lng: {
                  type: 'number',
                  example: -122.4194,
                },
                city: {
                  type: 'string',
                  example: 'San Francisco',
                },
                country: {
                  type: 'string',
                  example: 'USA',
                },
              },
            },
            performanceMetrics: {
              type: 'object',
              properties: {
                uptimePercentage: {
                  type: 'number',
                  example: 99.5,
                },
                dataTransferred: {
                  type: 'number',
                  example: 1073741824,
                },
                usersServed: {
                  type: 'number',
                  example: 150,
                },
                responseTime: {
                  type: 'number',
                  example: 25,
                },
              },
            },
          },
        },
        Reward: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            amount: {
              type: 'number',
              example: 150.5,
            },
            rewardType: {
              type: 'string',
              enum: ['coverage', 'traffic', 'reliability', 'bonus'],
              example: 'coverage',
            },
            status: {
              type: 'string',
              enum: ['pending', 'distributed', 'failed'],
              example: 'distributed',
            },
            transactionSignature: {
              type: 'string',
              example: '5VqgJG7...abc123',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            type: {
              type: 'string',
              enum: ['send', 'receive', 'reward'],
              example: 'send',
            },
            amount: {
              type: 'number',
              example: 100.5,
            },
            fromAddress: {
              type: 'string',
              example: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
            },
            toAddress: {
              type: 'string',
              example: 'H8sMJSFqXfqkXQN4LDF8pGsqjAE7QTwqyxoYhB9kQjTm',
            },
            signature: {
              type: 'string',
              example: '5VqgJG7...abc123',
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'failed'],
              example: 'confirmed',
            },
          },
        },
        BlogPost: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
              example: 'Building a Decentralized Internet',
            },
            slug: {
              type: 'string',
              example: 'building-decentralized-internet',
            },
            description: {
              type: 'string',
              example: 'How ThePublic is revolutionizing internet access',
            },
            content: {
              type: 'string',
              example: 'The internet has become...',
            },
            category: {
              type: 'string',
              example: 'Technology',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['blockchain', 'wifi', 'decentralization'],
            },
            published: {
              type: 'boolean',
              example: true,
            },
            featured: {
              type: 'boolean',
              example: false,
            },
            readTime: {
              type: 'number',
              example: 5,
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        NetworkStats: {
          type: 'object',
          properties: {
            totalNodes: {
              type: 'number',
              example: 1250,
            },
            activeNodes: {
              type: 'number',
              example: 1180,
            },
            totalUsers: {
              type: 'number',
              example: 15000,
            },
            dataTransferred: {
              type: 'number',
              example: 1099511627776,
            },
            uptimePercentage: {
              type: 'number',
              example: 99.2,
            },
            avgResponseTime: {
              type: 'number',
              example: 28,
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'ThePublic API Documentation',
  }));

  // Serve raw OpenAPI spec
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
}

export { specs as swaggerSpecs };
