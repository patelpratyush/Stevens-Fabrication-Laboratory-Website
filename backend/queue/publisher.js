import amqp from 'amqplib';

let channel = null;
let connection = null;

export async function connectQueue() {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    // Declare the orders.created queue with durable option
    await channel.assertQueue('orders.created', { durable: true });

    console.log('✓ RabbitMQ connected and queue asserted');
    return channel;
  } catch (error) {
    console.error('⚠ RabbitMQ connection failed:', error.message);
    console.log('  Make sure RabbitMQ is running: brew services start rabbitmq');
    // Don't crash the app if RabbitMQ is down
    return null;
  }
}

export async function enqueueOrderCreated(order, user) {
  try {
    if (!channel) {
      await connectQueue();
    }

    if (!channel) {
      console.warn('RabbitMQ not available - skipping email queue');
      return;
    }

    const message = {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      user: {
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name
      },
      totalPrice: order.totalPrice,
      items: order.items.map(item => ({
        serviceName: item.serviceName || 'Service',
        materialName: item.materialName || '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal
      })),
      files: order.files || [],
      createdAt: order.createdAt.toISOString()
    };

    channel.sendToQueue(
      'orders.created',
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );

    console.log(`✓ Order ${order.orderNumber} enqueued for email notifications`);
  } catch (error) {
    console.error('Error enqueueing order:', error.message);
    // Don't fail the order creation if queue fails
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
  console.log('RabbitMQ connection closed');
});
