const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
  const { PurchaseOrders, UserPurchaseOrders } = this.entities;

  // Simple logging for debugging - no automatic filtering
  this.before('READ', PurchaseOrders, async (req) => {
    console.log('Before READ handler called for PurchaseOrders');
    console.log('Request user:', req.user);
    console.log('Query:', req.query);
    // No filtering applied - let all data through
  });

  // Automatic user-based filtering for UserPurchaseOrders entity
  this.before('READ', UserPurchaseOrders, async (req) => {
    console.log('Before READ handler called for UserPurchaseOrders');
    
    // Apply automatic user filter - you can modify this logic as needed
    const currentUser = 'rahul.girmaji@consultsda.com'; // In real app, get from req.user.id
    
    console.log('Filtering UserPurchaseOrders for user:', currentUser);
    
    // Add user filter to the query
    req.query.where({ user: currentUser });
  });

  // Action handler for approve
  this.on('approve', PurchaseOrders, async (req) => {
    const { ID } = req.params[0];
    
    // Get the current PO to check status
    const po = await SELECT.one.from(PurchaseOrders).where({ ID });
    if (!po) {
      req.error(404, 'Purchase Order not found');
    }
    
    // Add confirmation message to the request info
    req.info(`Purchase Order ${po.poNumber} has been approved successfully.`);
    
    // Update the purchase order status
    await UPDATE(PurchaseOrders)
      .set({
        status: 'Approved',
        approvedBy: req.user.id || 'System',
        approvedDate: new Date().toISOString()
      })
      .where({ ID });

    // Return the updated entity
    return await SELECT.one.from(PurchaseOrders).where({ ID });
  });

  // Action handler for sendBack
  this.on('sendBack', PurchaseOrders, async (req) => {
    const { ID } = req.params[0];
    
    // Get the current PO to check status
    const po = await SELECT.one.from(PurchaseOrders).where({ ID });
    if (!po) {
      req.error(404, 'Purchase Order not found');
    }
    
    // Add confirmation message to the request info
    req.info(`Purchase Order ${po.poNumber} has been sent back successfully.`);
    
    // Update the purchase order status
    await UPDATE(PurchaseOrders)
      .set({
        status: 'Sent Back',
        approvedBy: null,
        approvedDate: null
      })
      .where({ ID });

    // Return the updated entity
    return await SELECT.one.from(PurchaseOrders).where({ ID });
  });

  // Action handler for reject
  this.on('reject', PurchaseOrders, async (req) => {
    const { ID } = req.params[0];
    
    // Get the current PO to check status
    const po = await SELECT.one.from(PurchaseOrders).where({ ID });
    if (!po) {
      req.error(404, 'Purchase Order not found');
    }
    
    // Add confirmation message to the request info
    req.info(`Purchase Order ${po.poNumber} has been rejected successfully.`);
    
    // Update the purchase order status
    await UPDATE(PurchaseOrders)
      .set({
        status: 'Rejected',
        approvedBy: null,
        approvedDate: null,
        rejectedBy: req.user.id || 'System',
        rejectedDate: new Date().toISOString()
      })
      .where({ ID });

    // Return the updated entity
    return await SELECT.one.from(PurchaseOrders).where({ ID });
  });

  // Custom function implementation
  this.on('getPODetails', async (req) => {
    const { user } = req.data;
    console.log('Getting PO details for user:', user);
    
    // Return POs for the specified user
    return await SELECT.from(PurchaseOrders).where({ user });
  });

  // Generic error handling
  this.on('error', (err, req) => {
    console.error('Service error:', err);
    req.error(err.code || 500, err.message || 'An error occurred');
  });
});