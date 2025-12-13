import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create Mailtrap transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.MAILTRAP_PORT) || 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

async function sendConfirmationEmail(order) {
  const itemsList = order.items
    .map(item => {
      const material = item.materialName ? ` (${item.materialName})` : '';
      return `<li>${item.serviceName}${material} - Qty: ${item.quantity} - $${item.lineTotal.toFixed(2)}</li>`;
    })
    .join('');

  const filesList = order.files && order.files.length > 0
    ? `<h3>Uploaded Files:</h3><ul>${order.files.map(f => `<li>${f.name}</li>`).join('')}</ul>`
    : '';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #A6192E;">Order Confirmation</h1>
      <p>Hi ${order.user.name},</p>
      <p>Your order has been received and is being processed by the Fab Lab staff.</p>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Order #${order.orderNumber}</h2>
        <p><strong>Status:</strong> Submitted</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <h3>Order Details:</h3>
      <ul>${itemsList}</ul>

      ${filesList}

      <div style="background: #A6192E; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin: 0;">Total: $${order.totalPrice.toFixed(2)}</h2>
      </div>

      <p>We'll notify you when your order is ready for pickup.</p>
      <p>Questions? Contact us at fablab@stevens.edu</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">
        Stevens Fabrication Laboratory<br>
        Morton Hall<br>
        Stevens Institute of Technology
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: '"Stevens Fab Lab" <noreply@fablab.stevens.edu>',
    to: order.user.email,
    subject: `Order ${order.orderNumber} Received`,
    html
  });
}

async function sendStaffNotification(order) {
  const itemsList = order.items
    .map(item => {
      const material = item.materialName ? ` (${item.materialName})` : '';
      return `<li>${item.serviceName}${material} - Qty: ${item.quantity} - $${item.lineTotal.toFixed(2)}</li>`;
    })
    .join('');

  const filesList = order.files && order.files.length > 0
    ? `<h3>Files:</h3><ul>${order.files.map(f => `<li><a href="${f.url}">${f.name}</a></li>`).join('')}</ul>`
    : '<p><em>No files uploaded</em></p>';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #A6192E;">New Order Received</h1>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Order #${order.orderNumber}</h2>
        <p><strong>Customer:</strong> ${order.user.name} (${order.user.email})</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
      </div>

      <h3>Items:</h3>
      <ul>${itemsList}</ul>

      ${filesList}

      <p><a href="http://localhost:3000/staff/dashboard" style="background: #A6192E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">View in Dashboard</a></p>
    </div>
  `;

  await transporter.sendMail({
    from: '"Fab Lab System" <noreply@fablab.stevens.edu>',
    to: process.env.STAFF_EMAIL || 'fablab@stevens.edu',
    subject: `New Order: ${order.orderNumber} from ${order.user.name}`,
    html
  });
}

async function startWorker() {
  try {
    console.log('Starting email worker...');

    // Connect to RabbitMQ
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    // Assert queue exists
    await channel.assertQueue('orders.created', { durable: true });

    // Prefetch 1 message at a time
    channel.prefetch(1);

    console.log('✓ Email worker connected to RabbitMQ');
    console.log('Waiting for orders on queue: orders.created...');

    // Consume messages
    channel.consume('orders.created', async (msg) => {
      if (!msg) return;

      try {
        const order = JSON.parse(msg.content.toString());
        console.log(`Processing order ${order.orderNumber}...`);

        // Send both emails
        await sendConfirmationEmail(order);
        console.log(`  ✓ Confirmation sent to ${order.user.email}`);

        await sendStaffNotification(order);
        console.log(`  ✓ Staff notification sent`);

        // Acknowledge message
        channel.ack(msg);
        console.log(`✓ Order ${order.orderNumber} processed successfully\n`);
      } catch (error) {
        console.error('Error processing message:', error);
        // Reject and requeue if there's an error
        channel.nack(msg, false, true);
      }
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\nShutting down email worker...');
      await channel.close();
      await connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start email worker:', error);
    console.log('\nMake sure RabbitMQ is running:');
    console.log('  brew services start rabbitmq');
    console.log('  OR');
    console.log('  docker run -d -p 5672:5672 rabbitmq:3');
    process.exit(1);
  }
}

// Start the worker
startWorker();
