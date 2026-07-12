const API_URL = 'http://localhost:5001/api';

async function fetchAPI(endpoint, method, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function runTests() {
  console.log('--- Starting End-to-End API Tests ---');
  let ownerToken = '';
  let customerToken = '';
  let vehicleId = '';
  let bookingId = '';

  try {
    // 1. Register Owner
    console.log('\n1. Registering Owner...');
    const ownerData = await fetchAPI('/auth/register', 'POST', {
      name: 'Test Owner',
      email: `owner_${Date.now()}@test.com`,
      password: 'password123',
      role: 'Owner',
      phone: '1234567890'
    });
    ownerToken = ownerData.token;
    console.log('✅ Owner registered successfully.');

    // 2. Register Customer
    console.log('\n2. Registering Customer...');
    const customerData = await fetchAPI('/auth/register', 'POST', {
      name: 'Test Customer',
      email: `customer_${Date.now()}@test.com`,
      password: 'password123',
      role: 'Customer',
      phone: '0987654321'
    });
    customerToken = customerData.token;
    console.log('✅ Customer registered successfully.');

    // 3. Create (List) Vehicle
    console.log('\n3. Creating (Listing) a Vehicle...');
    const vehiclePayload = {
      type: 'Car',
      brand: 'TestBrand',
      model: 'TestModel',
      year: 2023,
      registrationNumber: `REG-${Date.now()}`,
      color: 'Black',
      seatingCapacity: 5,
      description: 'This is a test vehicle description for the test e2e script.',
      insuranceValidTill: '2026-12-31',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      pricePerHour: 10,
      pricePerDay: 100,
      securityDeposit: 500,
      pickupAddress: '123 Test St',
      city: 'TestCity',
      state: 'TestState',
      zipCode: '12345',
      images: ['https://example.com/test-image.jpg']
    };
    const createdVehicle = await fetchAPI('/vehicles', 'POST', vehiclePayload, ownerToken);
    vehicleId = createdVehicle._id;
    console.log(`✅ Vehicle created successfully. ID: ${vehicleId}`);

    // 4. Edit Vehicle
    console.log('\n4. Editing the Vehicle...');
    const editedVehicle = await fetchAPI(`/vehicles/${vehicleId}`, 'PUT', {
      pricePerDay: 120
    }, ownerToken);
    if (editedVehicle.pricePerDay === 120) {
      console.log('✅ Vehicle edited successfully (price updated).');
    } else {
      throw new Error('Vehicle edit failed to apply.');
    }

    // 5. Book Vehicle
    console.log('\n5. Booking the Vehicle...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 2);
    
    const bookedVehicle = await fetchAPI('/bookings', 'POST', {
      vehicle: vehicleId,
      pickupDate: tomorrow.toISOString().split('T')[0],
      pickupTime: '10:00',
      returnDate: nextDay.toISOString().split('T')[0],
      returnTime: '10:00'
    }, customerToken);
    bookingId = bookedVehicle._id;
    console.log(`✅ Vehicle booked successfully. Booking ID: ${bookingId}`);

    // 6. Owner Accepts Booking
    console.log('\n6. Owner Accepts Booking...');
    await fetchAPI(`/bookings/${bookingId}/accept`, 'PATCH', null, ownerToken);
    console.log('✅ Booking accepted successfully.');

    // 7. Owner Marks Payment Received & Completes Booking
    console.log('\n7. Owner Marks Payment Received & Completes Booking...');
    await fetchAPI(`/bookings/${bookingId}/payment`, 'PATCH', null, ownerToken);
    await fetchAPI(`/bookings/${bookingId}/complete`, 'PATCH', null, ownerToken);
    console.log('✅ Booking completed successfully.');

    // 8. Delete Vehicle
    console.log('\n8. Deleting the Vehicle...');
    await fetchAPI(`/vehicles/${vehicleId}`, 'DELETE', null, ownerToken);
    console.log('✅ Vehicle deleted successfully.');

    console.log('\n🎉 All Core API Tests Passed Successfully! The application is ready for deployment.');

  } catch (error) {
    console.error('\n❌ Test Failed:');
    if (error.status) {
      console.error('Status:', error.status);
      console.error('Data:', error.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

runTests();
